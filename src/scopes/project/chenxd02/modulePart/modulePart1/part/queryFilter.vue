<template>
  <ta-modal
    width="50%"
    height="300px"
    :visible="visible"
    title="高级筛选"
    :destroy-on-close="true"
    :mask-closable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <ta-form layout="horizontal" :form-layout="true" label-width="100px" :auto-form-create="handleCreate">
      <ta-form-item label="性别" field-decorator-id="paSex" :span="9">
        <ta-radio-group collection-type="SEX" collection-filter="1,2" :reverse-filter="true" />
      </ta-form-item>
      <ta-form-item label="年龄" field-decorator-id="ageLower" :span="8">
        <ta-input placeholder="最低年龄" />
      </ta-form-item>
      <ta-form-item :span="2">
        <ta-input style="margin-left:5px;pointer-events: none; background-color: #f2f2f2" placeholder="~" disabled />
      </ta-form-item>
      <ta-form-item field-decorator-id="ageUpper" :span="5">
        <ta-input placeholder="最高年龄" />
      </ta-form-item>
      <ta-form-item label="西医病种" field-decorator-id="drgs" :span="24">
        <ta-select :options="options" :options-key="optionsKey" mode="multiple" />
      </ta-form-item>
      <ta-form-item label="治疗状态" field-decorator-id="treatStatus" :span="12" >
        <ta-radio-group button-style="solid">
          <ta-radio-button value="1">
            治疗中
          </ta-radio-button>
          <ta-radio-button value="2">
            未治疗
          </ta-radio-button>
        </ta-radio-group>
      </ta-form-item>
      <ta-form-item label="最近就诊日期" field-decorator-id="opTime" :span="24">
        <ta-range-picker :allow-one="true" :placeholder="['yyyy/mm/dd', 'yyyy/mm/dd']" />
      </ta-form-item>
      <ta-form-item label="建档日期" field-decorator-id="createTime" :span="24">
        <ta-range-picker :allow-one="true" :placeholder="['yyyy/mm/dd', 'yyyy/mm/dd']" />
      </ta-form-item>
    </ta-form>
  </ta-modal>
</template>

<script>
import { getMoment, } from '@yh/ta-utils'

export default {
  name: 'queryFilter',
  props: {
    visible: {
      type: Boolean,
    },
  },
  data () {
    return {
      options: [],
      optionsKey: {
        label: 'drgName',
        value: 'drgId',
      },
    }
  },
  methods: {
    handleSubmit () {
      // 获取数据，数据处理
      const formData = this.form2.getFieldsMomentValue()
      // message.info(JSON.stringify(formData.drgs))
      const params = {
        paSex: formData.paSex ?? '',
        ageLower: formData.ageLower ? parseInt(formData.ageLower) : '',
        ageUpper: formData.ageUpper ? parseInt(formData.ageUpper) : '',
        treatStatus: formData.treatStatus,
        drgs: formData.drgs ?? '',
        opTimeLower: formData.opTime ? formData.opTime[0].toString().substring(0, 10) : '',
        opTimeUpper: formData.opTime ? formData.opTime[1].toString().substring(0, 10) : '',
        createTimeLower: formData.createTime ? formData.createTime[0].toString().substring(0, 10) : '',
        createTimeUpper: formData.createTime ? formData.createTime[1].toString().substring(0, 10) : '',
      }
      // message.info(JSON.stringify(params))
      this.$emit('filter', params)
      this.$emit('cancel')
    },
    handleCancel () {
      this.$emit('cancel')
    },
    initData () {
      Base.submit(null, {
        url: 'outpatient/getDrgsOptions',
      }).then(data => {
        this.options = data.data.drgs
        console.log(this.options)
      })
    },

    handleCreate (form) {
      this.form2 = form
      this.$nextTick(function () {
        // 初始化下拉选项
        this.initData()
      })
    },
  },
}
</script>

<style scoped>

</style>
