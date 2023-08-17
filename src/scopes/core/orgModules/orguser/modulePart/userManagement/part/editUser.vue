<template>
  <ta-drawer
    :title="editType === '1'? '添加人员信息':'编辑人员信息'"
    placement="right"
    :closable="true"
    :visible="visible"
    destroy-on-close
    width="500px"
    :getContainer="setContainer"
    @close="closeEdit"
  >
    <ta-form id="userForm" :auto-form-create="(form)=>{this.form = form}">
      <template v-if="form">
        <template v-for="formSetting in formNormalSettings">
          <renderFormItem
            :key="formSetting.id"
            :form-setting="formSetting"
            :render-type="renderType"
            :render-prop="renderProp"
          >
            <div v-if="formSetting.id === 'avatar'" class="pos-avatar">
              <div v-if="imageUrl" class="img-avatar" :style="{ backgroundImage: 'url('+imageUrl+')'}" />
              <ta-icon v-if="imageUrl" class="clear-image" type="close" title="清空图片" @click="clearImage" />
              <ta-icon v-else class="icon-upload" :type="loading ? 'loading' : 'user'" />
              <input
                id="uploadPhotoId"
                type="file"
                class="hide-input"
                accept="image/gif,image/jpeg,image/jpg,image/png"
                @change="uploadPhoto($event)"
              >
            </div>
            <project-search-tree get-container-id="userManagement" v-else-if="formSetting.id === 'orgId'" />
            <template v-else-if="formSetting.id === 'orgIdShow'">
              {{ formData.namePath }}
            </template>
            <ta-input v-else-if="formSetting.id === 'password'" type="password" @blur="handleConfirmBlurs" />
            <ta-input v-else-if="formSetting.id === 'password_2'" type="password" />
            <template v-for="tag in tags" v-else-if="formSetting.id === 'tags'">
              <ta-tag :key="tag.tagId" :class="{'tag-active': selectedTags.indexOf(tag.tagId) > -1}" class="tag-select" @click="tagClick(tag.tagId)">
                {{ tag.tagName }}<ta-icon v-if="selectedTags.indexOf(tag.tagId) > -1" type="check" style="margin-left: 5px;" />
              </ta-tag>
            </template>
          </renderFormItem>
        </template>
        <ta-collapse v-if="formMoreSettings.length > 0" :bordered="false">
          <ta-collapse-panel key="1" header="更多个人信息" style="border:none; padding: 0px;" :force-render="true">
            <template v-for="formSetting in formMoreSettings">
              <renderFormItem
                :key="formSetting.id"
                :form-setting="formSetting"
                :render-type="renderType"
                :render-prop="renderProp"
              >
                <div v-if="formSetting.id === 'avatar'" class="pos-avatar">
                  <div v-if="imageUrl" class="img-avatar" :style="{ backgroundImage: 'url('+imageUrl+')'}" />
                  <ta-icon v-if="imageUrl" class="clear-image" type="close" title="清空图片" @click="clearImage" />
                  <ta-icon v-else class="icon-upload" :type="loading ? 'loading' : 'user'" />
                  <input
                    id="uploadPhotoId"
                    type="file"
                    class="hide-input"
                    accept="image/gif,image/jpeg,image/jpg,image/png"
                    @change="uploadPhoto($event)"
                  >
                </div>
                <project-search-tree v-else-if="formSetting.id === 'orgId'" />
                <template v-else-if="formSetting.id === 'orgIdShow'">
                  {{ formData.namePath }}
                </template>
                <ta-input v-else-if="formSetting.id === 'password'" type="password" @blur="handleConfirmBlurs" />
                <ta-input v-else-if="formSetting.id === 'password_2'" type="password" />
                <template v-for="tag in tags" v-else-if="formSetting.id === 'tags'">
                  <ta-tag :key="tag.tagId" :class="{'tag-active': selectedTags.indexOf(tag.tagId) > -1}" class="tag-select" @click="tagClick(tag.tagId)">
                    {{ tag.tagName }}<ta-icon v-if="selectedTags.indexOf(tag.tagId) > -1" type="check" style="margin-left: 5px;" />
                  </ta-tag>
                </template>
              </renderFormItem>
            </template>
          </ta-collapse-panel>
        </ta-collapse>
      </template>
    </ta-form>
    <div slot="footer">
      <ta-button-group>
        <ta-button @click="onResetForm()">
          重置
        </ta-button>
        <ta-button type="primary" @click="onSubmitForm()">
          保存
        </ta-button>
      </ta-button-group>
    </div>
  </ta-drawer>
</template>
<script>
import $api from '../api/index'
import renderFormItem from '@projectCommon/components/renderFormItem'
import mixins from '../mixins'
import { mapGetters, } from 'vuex'
import checkPass from '@yh/ta-utils/checkPass'
import { cryptoAsymmetricFn, } from '@yh/ta404-ui/es/utils/js/cryptoFn'

function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  name: 'EditUser',
  components: { renderFormItem, },
  mixins: [mixins],
  props: ['visible', 'editType', 'rowData'],
  data () {
    return {
      form: null,
      formData: {},
      tags: [],
      initTags: [],
      selectedTags: [],
      // 密码规则校验
      pwdRules: {
        rules: [{
          required: true, message: '请输入登录口令',
        }, {
          min: 6, message: '登录口令不能少于6位字符',
        }, {
          validator: this.validatePwd,
        }],
      },
      confirmDirty: false,
      loading: false,
      imageUrl: '',
      initImg: '',
      options: [],
      rsaKey: {},
      initForm: {},
    }
  },
  mounted () {
    this.setValue()
  },
  created () {
    this.$store.dispatch('getSysCfg')
  },
  computed: {
    ...mapGetters({
      passwordRSAState: 'passwordRSAState',
      passwordLevel: 'passwordLevel',
    }),
    renderType () {
      return this.editType === '2' ? 'EDIT' : 'ADD'
    },
    renderProp () {
      return {
        authRequest: (param, resolve) => {
          const { userId, } = this.rowData
          $api.authRequestForUserInfo({
            ...param,
            userId,
          }, (data) => { resolve(data.userInfo[param.inputKey]) })
        },
      }
    },
  },
  methods: {
    setContainer() {
      return document.getElementById('userManagement')
    },
    setValue () {
      // type = 1 新增，type=2 编辑
      const { userId, jobNumber, mobile, email, address, zipCode, workplace, } = this.rowData
      if (this.editType === '2') {
        Object.keys(this.rowData).forEach(field => {
          this.formData[field] = this.rowData[field] || ''
        })
        this.queryPortrait({ userId: userId, })
      } else {
        this.formData.sex = '0'
      }
      this.initForm = Object.assign({}, this.formData, {
        jobNumber: jobNumber || '',
        mobile: mobile || '',
        email: email || '',
        address: address || '',
        zipCode: zipCode || '',
        workplace: workplace || '',
      });
      this.getUserTags({ userId: userId, })
    },
    // 获取用户标签
    getUserTags (obj) {
      $api.queryTagByUserId(obj, (result) => {
        this.tags = result.data.tagList
        this.initTags = []
        this.selectedTags = []
        for (let i = 0; i < this.tags.length; i++) {
          if (this.tags[i].isChecked === '1') {
            this.initTags.push(this.tags[i].tagId)
          }
        }
        if (this.initTags.length) {
          this.selectedTags = this.initTags
        }
        this.formData.tags = this.selectedTags;
        this.buildForm(this.formData);
      })
    },
    queryPortrait (obj) {
      $api.queryAvatar(obj, (data) => {
        this.imageUrl = data.data.portrait || ''
        this.initImg = this.imageUrl
      })
    },
    validatePwd (rule, value, callback) {
      if (value && this.confirmDirty) {
        this.form.validateFields(['password_2'], { force: true, })
      }
      // 检查并提示密码强度
      const modes = checkPass(value)
      if (this.passwordLevel === 1) {
        if (modes !== this.passwordLevel) {
          // eslint-disable-next-line node/no-callback-literal
          callback('请输入6位数字')
        }
      } else {
        if (modes < this.passwordLevel) {
          // eslint-disable-next-line node/no-callback-literal
          callback('请至少包含大写字母、小写字母、数字、特殊字符(除去空格)中的' + this.passwordLevel + '种，且长度为8~20位')
        } else {
          callback()
        }
      }
    },
    compareToFirstPwd (rule, value, callback) {
      if (value && value !== this.form.getFieldValue('password')) {
        // eslint-disable-next-line node/no-callback-literal
        callback('两次口令输入不一致')
      } else {
        callback()
      }
    },
    handleConfirmBlurs (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    tagClick (tagId) {
      const { selectedTags, } = this
      const checked = selectedTags.some(t => t === tagId)
      this.selectedTags = checked ? selectedTags.filter(t => t !== tagId) : [...selectedTags, tagId];
      this.form.setFieldsValue({tags: this.selectedTags}); //将选中的tags值赋值给表单。
    },
    closeEdit () {
      this.$emit('close')
      this.form.resetFields()
      this.formData = {}
      this.imageUrl = ''
      this.initImg = ''
    },
    onResetForm () {
      this.form.resetFields()
      this.imageUrl = ''
      this.selectedTags = this.initTags
      if (this.editType === '2') {
        this.queryPortrait({ userId: this.formData.userId, })
      }
      document.getElementById('uploadPhotoId').value = ''
    },
    uploadPhoto (e) {
      const file = e.target.files[0]
      const obj = document.getElementById('uploadPhotoId')
      if (file) {
        this.loading = true
        if (file.size > 51200) {
          this.$message.error('用户头像大小不能超过50kb')
          this.loading = false
          obj.value = ''
          return false
        }
        getBase64(file, (imageUrl) => {
          this.imageUrl = imageUrl || ''
          this.loading = false
        })
      }
    },
    clearImage () {
      this.imageUrl = ''
      document.getElementById('uploadPhotoId').value = ''
    },
    onSubmitForm () {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (this.selectedTags.length) {
            values.tags = this.selectedTags.join(',')
          }
          values.portrait = this.imageUrl || ''
          if (values.idCardType === undefined) {
            values.idCardType = ''
          }
          delete values.password_2
          // 加密
          values.password = cryptoAsymmetricFn(values.password)
          if (this.editType === '2') {
            values.userId = this.formData.userId
            values.orgId = this.formData.orgId
            values.jobNumber = values.jobNumber || ''
            values.mobile = values.mobile || ''
            values.email = values.email || ''
            values.address = values.address || ''
            values.zipCode = values.zipCode || ''
            values.workplace = values.workplace || ''
            values.selectedTags = values.selectedTags || []

            /* 判断提交时有无改变 */
            const tempValue = { ...values, }; const keys = Object.keys(tempValue); const { initForm, } = this
            let editFlag = false
            if (this.initImg === tempValue.portrait) {
              for (let i = 0; i < keys.length; i++) {
                if (keys[i] !== 'password' && keys[i] !== 'portrait' && initForm[keys[i]] !== tempValue[keys[i]]) {
                  editFlag = true
                  break
                }
              }
            } else {
              editFlag = true
            }
            if (editFlag) {
              $api.updateUserByUserId(values, (data) => {
                this.$message.success('更新人员信息成功')
                this.$emit('editSuccess', values)
                this.closeEdit()
              })
            } else {
              this.$message.warning('没有需要保存的修改')
            }
          } else {
            $api.addUser(values, (data) => {
              if (data.data.addUser) {
                this.showConfirm()
              }
            })
          }
        }
      })
    },
    // 提示
    showConfirm () {
      const confirm = this.$confirm({
        title: '保存人员信息成功',
        content: '保存成功。是否继续新增人员?',
        // onOk: () => {
        //   this.form.resetFields()
        //   this.selectedTags = []
        //   this.imageUrl = ''
        //   document.getElementById('uploadPhotoId').value = ''
        //   this.$emit('queryTable')
        // },
        footer: (<span><ta-button onclick={() => this.handleCancel(confirm)}>取消</ta-button><ta-button type="primary" onclick={() => this.handleOk(confirm)}>确定</ta-button><ta-button type="primary" onclick={() => this.handleOk2(confirm)}>同组织新增</ta-button></span>),
        // onCancel: () => {
        //   this.closeEdit()
        //   this.$emit('queryTable')
        // }
      })
    },
    handleCancel (confirm) {
      this.closeEdit()
      this.$emit('queryTable')
      confirm.destroy()
    },
    handleOk (confirm) {
      this.form.resetFields()
      this.selectedTags = []
      this.imageUrl = ''
      document.getElementById('uploadPhotoId').value = ''
      this.$emit('queryTable')
      confirm.destroy()
    },
    handleOk2 (confirm) {
      const tmp = this.form.getFieldValue('orgId')
      this.form.resetFields()
      this.selectedTags = []
      this.imageUrl = ''
      document.getElementById('uploadPhotoId').value = ''
      this.$emit('queryTable')
      this.form.setFieldsValue({
        orgId: tmp,
      })
      confirm.destroy()
    },
  },
}
</script>
<style type="text/less" lang="less">
.avatar-form-item .ant-form-item-label {
  margin-top: 12px;
}
</style>
<style scoped type="text/less" lang="less">
.pos-avatar {
  position: relative;
  width: 64px;
  height: 64px;
  line-height: 64px;
  margin-left: 10px;
  font-size: 32px;
  text-align: center;
  background: #ccc;
  color: #fff;
  border-radius: 100%;
  cursor: pointer;

  &:hover .icon-upload:before {
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='64 64 896 896' data-icon='plus' width='1em' height='1em' fill='currentColor' aria-hidden='true' focusable='false' class=''%3E%3Cpath d='M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z'%3E%3C/path%3E%3Cpath d='M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z'%3E%3C/path%3E%3C/svg%3E");
  }
}

.img-avatar {
  width: 64px;
  height: 64px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 100%;
}

.hide-input {
  width: 64px;
  height: 64px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  z-index: 1;
  background: transparent;
  cursor: pointer;
  border-radius: 100%;
}

.tag-select {
  border-color: @primary-color;
  color: @primary-color;
  .user-select()
}

.tag-active {
  background-color: @primary-color;
  color: @white !important;
}

.clear-image {
  position: absolute;
  color: #F56C6C;
  top: 0;
  right: -20px;
  font-size: 16px;
}
</style>
