<template>
  <ta-border-layout>
    <ta-card title="分步表单" class="mg-b20">
      <ta-row>
        <ta-steps :current="stepIndex - 1">
          <ta-step title="填写转账信息" />
          <ta-step title="确认转账信息" />
          <ta-step title="完成" />
        </ta-steps>
      </ta-row>
      <ta-row>
        <ta-divider />
      </ta-row>
      <ta-row>
        <step1 v-show="stepIndex === 1" ref="step1" />
        <step2 v-show="stepIndex === 2" ref="step2" />
        <step3 v-show="stepIndex === 3" ref="step3" />
      </ta-row>
      <ta-row>
        <ta-divider />
      </ta-row>
      <ta-row>
        <ta-button v-if="stepIndex!==1 && stepIndex!==3" :disabled="stepIndex===1" @click="prevStep">
          返回
        </ta-button>
        <ta-button v-if="!canSubmit && stepIndex!==3" :type="'primary'" @click="nextStep">
          {{ stepIndex===2?'提交':'下一步' }}
        </ta-button>
      </ta-row>
    </ta-card>
  </ta-border-layout>
</template>
<script>
import step1 from './part/step1.vue'
import step2 from './part/step2.vue'
import step3 from './part/step3.vue'
export default {
  components: {
    step1,
    step2,
    step3,
  },
  data () {
    return {
      visibleModal: false,
      stepIndex: 1,
      canSubmit: false,
    }
  },
  methods: {
    openModal () {
      this.visibleModal = true
    },
    close () {
      this.visibleModal = false
      this.stepIndex = 1
    },
    prevStep () {
      this.stepIndex--
    },
    nextStep () {
      switch (this.stepIndex) {
        case 1:
          this.submitStep1()
          break
        case 2:
          this.submitStep2()
          break
        case 3:
          this.submitStep3()
          break
      }
    },
    submitStep1 () {
      Base.submit(null, {
        url: 'http/mock/projectDemo/stepForm/step1',
        data: {
          ...this.$refs.step1.getFormData(),
        },
        reqDataLevel: 0,
      }, {
        successCallback: (data) => {
          // 后端确认数据正确然后进入下一步
          if (data.data.validate) {
            this.stepIndex++
            this.$refs.step2.setFormData(this.$refs.step1.getFormData())
          } else {
            this.$message.error('用户名输入错误!请输入admin!')
          }
        },
      })
    },
    submitStep2 () {
      Base.submit(null, {
        url: 'http/mock/projectDemo/stepForm/step2',
        data: {
          ...this.$refs.step2.getFormData(),
        },
        reqDataLevel: 0,
      }, {
        successCallback: (data) => {
          // 后端确认数据正确然后进入下一步
          if (data.data.validate) {
            this.stepIndex++
            this.$refs.step3.setFormData(this.$refs.step1.getFormData())
          } else {
            this.$message.error('支付密码输入错误!')
          }
        },
      })
    },
    submitStep3 () {
      Base.submit(null, {
        url: 'http/mock/projectDemo/stepForm/step3',
        data: {
          ...this.$refs.step3.getFormData(),
        },
        reqDataLevel: 0,
      }, {
        successCallback: (data) => {
          // 后端确认数据正确然后进入下一步
          if (data.data.validate) {
            this.$message.success('当前步骤数据验证成功!将提交分步表单!')
            this.submit()
          } else {
            this.$message.error('答案输入错误;请输入1!')
          }
        },
      })
    },
    // 全部提交
    submit () {
      const formData = {
        ...this.$refs.step1.getFormData(),
        ...this.$refs.step2.getFormData(),
        ...this.$refs.step3.getFormData(),
      }
      Base.submit(null, {
        url: 'http/mock/projectDemo/stepForm/submitAll',
        data: formData,
        reqDataLevel: 0,
      }, {
        successCallback: (data) => {
          console.log(data)
          this.$message.success('分步表单提交成功!')
        },
      })
      this.close()
    },
  },
}
</script>
<style type="text/less" lang="less">

</style>
