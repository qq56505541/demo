<template>
  <!--5. 重置密码模态框-->
  <ta-modal :getContainer="setContainer" title="重置密码" :visible="visible" okText="确认" cancelText="关闭" @ok="resetPwd" width="400px" @cancel="closeModal" :bodyStyle="{'height': '160px'}" size="small" destroyOnClose>
    <ta-form id="pwdForm" :autoFormCreate="(form)=>{this.formPass = form}">
      <ta-form-item
        label='登录口令'
        :labelCol="{ span: 7 }"
        :wrapperCol="{ span: 17 }"
        fieldDecoratorId="password"
        :fieldDecoratorOptions="pwdRules"
      >
        <ta-input type='password' @blur="blurPwd"/>
      </ta-form-item>
      <ta-form-item
        label='确认口令'
        :labelCol="{ span: 7 }"
        :wrapperCol="{ span: 17 }"
        fieldDecoratorId="password_2"
        :fieldDecoratorOptions="{rules: [{ validator: this.compareToFirstPwd},{ required: true, message: '请再次输入登录口令!' }]}"
      >
        <ta-input type='password'/>
      </ta-form-item>
    </ta-form>
  </ta-modal>
</template>
<script>
import $api from '../api/index'
import checkPass from '@yh/ta-utils/checkPass'
import {mapGetters,} from 'vuex'
import { cryptoAsymmetricFn, } from '@yh/ta404-ui/es/utils/js/cryptoFn'

export default {
  name: 'resetPwd',
  props: ['visible', 'userId'],
  data () {
    return {
      formPass: null,
      pwdRules: {
        rules: [{
          required: true, message: '请输入登录口令!'
        }, {
          validator: this.validatePwd
        }]
      }
    }
  },
  computed: {
    ...mapGetters({
      passwordRSAState: 'passwordRSAState',
      passwordLevel: 'passwordLevel'
    }),
  },
  created(){
    this.$store.dispatch('getSysCfg')
  },
  methods: {
    setContainer () {
      return document.getElementById('userManagement')
    },
    blurPwd (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    compareToFirstPwd (rule, value, callback) {
      const form = this.formPass
      if (value && value !== form.getFieldValue('password')) {
        callback('两次口令输入不一致!')
      } else {
        callback()
      }
    },
    validatePwd (rule, value, callback) {
      const form = this.formPass
      if (value && this.confirmDirty) {
        form.validateFields(['password_2'], {force: true})
      }
      // 检查并提示密码强度
      const modes = checkPass(value)
      if(this.passwordLevel == 1){
        if (modes != this.passwordLevel){
          callback('请输入6位数字')
        }
      }else{
        if (modes < this.passwordLevel) {
          callback('请至少包含大写字母、小写字母、数字、特殊字符(除去空格)中的' + this.passwordLevel + '种，且长度为8~20位')
        } else {
          callback()
        }
      }
    },
    resetPwd () {
      this.formPass.validateFields((err, values) => {
        if (!err) {
          let password = cryptoAsymmetricFn(values.password)
          $api.updateUserPwdByUserId({'password': password, 'userId': this.userId}, (data) => {
            this.$emit('queryTable')
            this.closeModal()
            this.$message.success('重置密码成功')
          })
        }
      })
    },
    closeModal () {
      this.formPass.resetFields()
      this.$emit('close')
    }
  }
}
</script>
