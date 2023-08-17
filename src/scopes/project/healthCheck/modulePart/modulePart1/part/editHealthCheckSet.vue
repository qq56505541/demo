<template>
  <ta-modal
    width="880px"
    height="490px"
    :title="title"
    :visible="visible"
    :destory-on-close="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <ta-form :auto-form-create="handleCreate">
      <!-- 利用栅格布局完成界面的布局设计 -->
      <ta-row :gutter="32">
        <ta-col :span="12">
          <ta-form-item label="套餐ID" field-decorator-id="setId">
            <ta-input disabled placeholder="自动生成" />
          </ta-form-item>
          <ta-form-item field-decorator-id="setName" label="套餐名称" :require="{message: '请输入体检套餐名称'}">
            <ta-input />
          </ta-form-item>
          <ta-form-item label="适用城市" field-decorator-id="city" :require="{message:'请选择适用城市!'}">
            <ta-cascader :options="options" :field-names="mapFieldNames" placeholder="请选择适用城市" />
          </ta-form-item>
          <ta-form-item label="适用标签" field-decorator-id="label" :require="{message:'请选择标签!'}">
            <ta-checkbox-group collection-type="SUITLABEL" />
          </ta-form-item>
          <ta-form-item label="有效时间截至" field-decorator-id="expireDate" :require="{message:'请输入有效截止日期!'}">
            <ta-date-picker style="width: 100%" />
          </ta-form-item>
          <ta-row :gutter="32">
            <ta-col :span="12">
              <ta-form-item label="售价" label-width="96" field-decorator-id="setPrice" :require="{message:'请输入售价!'}">
                <ta-input-number style="width: 100%" />
              </ta-form-item>
            </ta-col>
            <ta-col :span="12">
              <ta-form-item
                label="订购数量"
                label-width="96"
                field-decorator-id="orderQuantity"
                :require="{message:'请输入订购数量!'}"
              >
                <ta-input-number style="width: 100%" />
              </ta-form-item>
            </ta-col>
          </ta-row>
          <ta-form-item
            label="是否启用"
            field-decorator-id="isOpen"
            :init-value="true"
            value-prop-name="checked"
            :require="{message:'请选择是否启用!'}"
          >
            <ta-switch />
          </ta-form-item>
        </ta-col>
        <ta-col :span="12">
          <ta-upload name="bannerFile" list-type="picture" :show-upload-list="false" :before-upload="beforeUpload">
            <img v-if="imageUrl" :src="imageUrl" style="width: 100%; max-height:400px">
            <img v-else :src="imgPic" style="width: 100%; max-height:400px">
          </ta-upload>
        </ta-col>
        <ta-col :span="24">
          <ta-form-item label="套餐介绍" field-decorator-id="setDesc" :label-width="110">
            <ta-textarea :autosize="{ minRows: 4, maxRows: 12 }" />
          </ta-form-item>
        </ta-col>
      </ta-row>
    </ta-form>
  </ta-modal>
</template>

<script>
export default {
  name: 'editHealthCheckSet',
  props: {
    title: {
      type: String,
    },
    visible: {
      type: Boolean,
    },
    record: {
      type: Object,
    },
  },
  data () {
    return {
      options: [],
      mapFieldNames: {
        label: 'name', value: 'id', children: 'children',
      },
      imageUrl: '',
      imgPic: require('../img/u432.png'),
      bannerFile: [],
    }
  },
  methods: {
    initData () {
      // 加载cascader数据
      Base.submit(null, {
        url: 'healthCheckServiceMg/getCityInfo',
      }).then(res => {
        this.options = res.data.cityTree
      })
    },
    handleCancel () {
      this.$emit('cancel', false)
    },
    handleSubmit () {
      this.editForm.validateFields((errors, value) => {
        if (errors) {
          // 有错误信息，触发校验规则
        } else {
          // 完成数据提交
          const formData = this.editForm.getFieldsValue() // 获取数据
          formData.suitCity = formData.city ? formData.city.join('/') : null // 数据格式转换, 针对后台接口的字段格式完成
          formData.suitLabel = formData.label ? formData.label.join('/') : null
          formData.status = formData.isOpen ? '1' : '0'
          formData.expireTime = formData.expireDate.format('YYYY-MM-DD')
          formData.bannerFile = this.bannerFile // 提交选择的文件对象
          let msg = ''
          if (formData.setId === undefined) {
            msg = '保存体检套餐信息成功'
          } else {
            msg = '修改体检套餐信息成功'
          }
          Base.submit(this.editForm, {
            url: 'healthCheckServiceMg/saveHealthCheckSetInfo',
            data: formData, // 参数
            autoValid: true, // 自动校验
            isFormData: true, // 提价文件上传时候必须设置true
          }).then(res => {
            this.imageUrl = ''
            this.bannerFile = []
            this.$emit('cancel', false) // 回调父组件进行窗口关闭
            this.$message.success(msg)
          })
        }
      })
    },
    handleCreate (form) { // 通过函数去创建表达对象 :auto-form-create="(form)=>{this.editForm=form}"
      this.editForm = form
      this.editForm.setFieldsValue(null) // 清空操作
      this.$nextTick(function () {
        this.initData()
        // 完成数据回显...
        if (this.record !== null && this.record !== undefined && this.record.setId !== undefined) {
          this.editForm.setFieldsValue(this.record)
          this.editForm.setFieldsValue({ isOpen: (this.record.status !== '0'), }) // 回显swtich的开启状态 checked=true
          if (this.record.expireTime !== undefined && this.record.expireTime != null) {
            this.editForm.setFieldsMomentValue({ expireDate: this.record.expireTime, }) // 设置时间组件的值
          }
          // 通过接口去读取图片的封面地址
          Base.submit(null, {
            url: 'healthCheckServiceMg/getAttachmentInfoBySetId',
            data: { setId: this.record.setId, },
          }).then(res => {
            // 封面图片路径
            this.imageUrl = res.data.imgUrl
          })
        }
      })
    },
    getBase64 (img, callback) {
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    },
    beforeUpload (file) {
      this.getBase64(file, (imgUrl) => {
        file.url = imgUrl // base64图片编码地址
        this.bannerFile[0] = file // 保存选择好的图片对象
        this.imageUrl = file.url
      })
      return false // 阻止图片或者文件进行异步的上传
    },
  },
}
</script>

<style scoped>

</style>
