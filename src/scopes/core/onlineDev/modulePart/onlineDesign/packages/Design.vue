<template>
  <div class="fit" style="overflow-y: auto;overflow-x: hidden">
    <div
      style="z-index:1;padding: 20px;height: 72px;line-height:72px;position: fixed;left: 0;top: 0;width: calc(100% - 6px)"
    >
      <ta-steps :current="currentStep">
        <ta-step v-for="item in steps" :key="item.title" :title="item.title"/>
      </ta-steps>
    </div>
    <div :style="contentStyle" style="padding: 72px 0 47px 0;height: 100%">
      <design-table
        :style="`display: inline-block;vertical-align: top;width: ${1 / steps.length * 100}%;`"
      />
      <choice-feat
        :style="`display: inline-block;vertical-align: top;width: ${1 / steps.length * 100}%;`"
      />
      <form-designer
        ref="formDesigner"
        :init-data="formTemplate"
        :module-part-id="''"
        @saveTemplate="handleFormSave"
        :style="`height: calc(100vh - 119px);display: inline-block;vertical-align: top;width: ${1 / steps.length * 100}%;`"
      />
      <Generator
        v-if="currentStep === 3"
        :style="`display: inline-block;vertical-align: top;width: ${1 / steps.length * 100}%;`"
        :all-data="this.tempData"
      />
    </div>
    <div
      :style="currentStep !== 3 ? 'z-index:1;text-align: center;height:47px;position: fixed;left: 0;bottom: 0;width: calc(100% - 6px);padding-bottom: 15px;' : 'text-align: center'"
    >
      <ta-button
        :disabled="currentStep === 0"
        @click="up"
        style="margin-right: 20px"
      >
        上一步
      </ta-button>
      <ta-button
        type="primary"
        v-if="currentStep < steps.length - 1"
        :disabled="nextDisabled"
        @click="down"
      >
        下一步
      </ta-button>
      <ta-button
        type="primary"
        key="save"
        v-if="currentStep === 3"
        @click="save"
      >
        保存
      </ta-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, } from 'vuex'
import DesignTable from './DesignTable'
import ChoiceFeat from './ChooseFeat'
import FormDesigner from '../../../../onlineForm/modulePart/formMaker/packages/formDesigner'
import Generator from './Generator'

export default {
  name: 'Design',
  components: { DesignTable, ChoiceFeat, FormDesigner, Generator, },
  data () {
    return {
      allData: {},
    }
  },
  computed: {
    ...mapState('design', [
      'currentStep',
      'steps',
      'tableColumns',
      'featData',
      'formTemplate',
      'apis',
      'tableName',
      'primaryKey'
    ]),
    ...mapGetters('design', [
      'nextDisabled'
    ]),
    contentStyle () {
      return {
        transform: `translate(-${1 / this.steps.length * 100 * this.currentStep}%, 0%)`,
        transition: 'all .5s ease',
        overflowX: 'hidden',
        width: `${100 * this.steps.length}%`,
        paddingBottom: this.currentStep === 3 ? 0 : undefined,
        height: this.currentStep === 3 ? 'auto' : undefined,
      }
    },
  },
  created () {
    this.$bus.on('checkSaveFormTemplate', this.checkSaveFormTemplate)
  },
  beforeDestroy () {
    this.$bus.off('checkSaveFormTemplate', this.checkSaveFormTemplate)
  },
  methods: {
    up () {
      this.$store.dispatch('design/changeCurrentStep', this.currentStep - 1)
    },
    down () {
      let data = null
      if (this.currentStep === 2) {
        data = this.$refs.formDesigner.$data.formData
        this.allData = JSON.parse(JSON.stringify({
          tableColumns: this.tableColumns,
          featData: this.featData,
          formTemplate: data,
          apis: this.apis,
          primaryKey: this.primaryKey,
          tableName: this.tableName,
        }))
        this.tempData = JSON.parse(JSON.stringify(this.allData))
      }
      this.$store.dispatch('design/checkBeforeNext', {
        step: this.currentStep + 1,
        data,
      })
    },
    handleFormSave ({ templateContent, }) {
      this.$store.dispatch('design/setFormTemplate', JSON.parse(templateContent))
        .then(() => this.$message.success('保存表单信息成功'))
    },
    checkSaveFormTemplate (data, resolve) {
      this.$confirm({
        title: 'Form改动提醒',
        content: 'Form表单模板有改动，是否保存？',
        onOk: () => {
          this.$store.dispatch('design/setFormTemplate', data).then(() => {
            this.$message.success('保存表单信息成功')
            resolve()
          })
        },
        onCancel: () => resolve(),
      })
    },
    save () {
      this.$confirm({
        title: '保存',
        content: '将会覆盖旧模板，确定保存更改？',
        onOk: () => {
          this.$emit('saveTemplate', {
            templateContent: JSON.stringify(this.allData),
          })
        },
      })
    },
  },
}
</script>
