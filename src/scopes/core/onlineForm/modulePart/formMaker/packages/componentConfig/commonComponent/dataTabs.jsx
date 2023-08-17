export default {
  name: 'dataTabs',
  // v-model配置
  model: {
    prop: 'config',
    event: 'change'
  },
  props: {
    // 要渲染的tab页
    tabsName: {
      type: Array,
      default: () => {
        return ['static', 'dict', 'remote']
      }
    },
    // form-item的配置
    config: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      urlError: false, // 远程数据的url校验标志位
      paramsError: false, // 远程数据的params校验标志位
      resNameError: false // 远程数据的resName校验标志位
    }
  },
  created () {
    // 初始化校验
    if (!this.config.url || this.config.url?.length === 0) this.urlError = true
    if (!this.config.resName || this.config.resName?.length === 0) this.resNameError = true
    try {
      if (this.config.params !== undefined && this.config.params.length !== 0) {
        JSON.parse(this.config.params.replace(/'/g, '"'))
      }
    } catch (e) {
      this.paramsError = true
    }
  },
  computed: {
    // staticTab渲染的数据，作用域插槽内有static插槽的话就渲染插槽，否则渲染默认数据
    staticTab () {
      if (this.$scopedSlots.static) {
        return this.$scopedSlots.static({
          config: this.config
        })
      } else {
        return <div>
          {/* 默认数据头 */}
          <ta-row gutter={16} style={{ marginBottom: '10px' }}>
            <ta-col span={10}>
              <span style={{ fontWeight: 800, marginLeft: '5px', lineHeight: '32px' }}>Value</span>
            </ta-col>
            <ta-col span={10}>
              <span style={{ fontWeight: 800, marginLeft: '5px', lineHeight: '32px' }}>Label</span>
            </ta-col>
            <ta-col span={4}>
              <ta-button
                type={'primary'}
                shape={'circle'}
                icon={'plus'}
                onclick={this.fnOnAddStaticData}/>
            </ta-col>
          </ta-row>
          {/* 默认数据List */}
          {this.config.staticData.map((item, index) =>
            <ta-row key={index} gutter={16} style={{ marginBottom: '10px' }}>
              <ta-col span={10}>
                <ta-input vModel_trim={item.value}/>
              </ta-col>
              <ta-col span={10}>
                <ta-input vModel_trim={item.label}/>
              </ta-col>
              <ta-col span={4}>
                <ta-button type={'danger'} shape={'circle'} icon={'minus'}
                           onclick={this.fnOnDeleteStaticData.bind(this, index)}/>
              </ta-col>
            </ta-row>
          )}
        </div>
      }
    }
  },
  methods: {
    // url校验
    fnOnUrlBlur () {
      if (!this.config.url || this.config.url?.length === 0) {
        this.$message.error('URL不能为空')
        this.urlError = true
      } else {
        this.urlError = false
      }
    },
    // params校验
    fnOnParamsBlur () {
      this.paramsError = false
      try {
        if (this.config.params !== undefined && this.config.params.length !== 0) {
          JSON.parse(this.config.params.replace(/'/g, '"'))
        }
      } catch (e) {
        this.$message.error('params不是JSON格式，解析错误')
        this.paramsError = true
      }
    },
    // resName校验
    fnOnResNameBlur () {
      if (!this.config.resName || this.config.resName?.length === 0) {
        this.$message.error('resName不能为空')
        this.resNameError = true
      } else {
        this.resNameError = false
      }
    },
    // static默认数据添加item
    fnOnAddStaticData () {
      this.config.staticData.push({ label: '', value: '' })
    },
    // static默认数据删除item
    fnOnDeleteStaticData (index) {
      this.config.staticData.splice(index, 1)
    }
  },
  render () {
    const { config, staticTab } = this
    return (
      <ta-tabs
        defaultActiveKey={config.dataType}
        vModel={config.dataType}>
        {/* 静态数据tab页 */}
        {this.tabsName.includes('static') && <ta-tab-pane tab={'静态数据'} key={'static'}>
          {staticTab}
        </ta-tab-pane>}
        {/* 字典数据tab页 */}
        {this.tabsName.includes('dict') && <ta-tab-pane tab={'字典数据'} key={'dict'}>
          <ta-label-con label={'字典类型'}>
            <ta-input vModel_trim={config.collectionType} placeholder="请输入字典类型"/>
          </ta-label-con>
          <ta-label-con label="过滤">
            <ta-input vModel_trim={config.collectionFilter} placeholder="请输入过滤字典键值，逗号隔开"/>
          </ta-label-con>
          <ta-label-con label="反向过滤" style="margin-bottom: 0">
            <ta-switch vModel={config.reverseFilter}/>
          </ta-label-con>
        </ta-tab-pane>}
        {/* 远程数据tab页 */}
        {this.tabsName.includes('remote') && <ta-tab-pane tab="远程数据" key="remote">
          <ta-label-con label="URL" class={{ 'has-error': this.urlError }}>
            <ta-input style="width: 90%" placeholder="请输入URL(必填)" vOn:blur={this.fnOnUrlBlur}
                      vModel_trim={config.url}/>
            <ta-popover
              width="220"
              placement="top"
              trigger="hover"
              content="例如：codetable/getCode">
              <ta-icon slot="reference" type="question-circle" style="cursor: pointer;margin-left: 10px;"/>
            </ta-popover>
          </ta-label-con>
          <ta-label-con label="Params" class={{ 'has-error': this.paramsError }}>
            <ta-input style="width: 90%" placeholder="请输入参数(JSON格式)" vOn:blur={this.fnOnParamsBlur}
                      vModel_trim={config.params}/>
            <ta-popover
              width="220"
              placement="top"
              trigger="hover"
              content="例如：{'codeType':'SEX'}">
              <ta-icon slot="reference" type="question-circle" style="cursor: pointer;margin-left: 10px;"/>
            </ta-popover>
          </ta-label-con>
          <ta-label-con label="resName" class={{ 'has-error': this.resNameError }}>
            <ta-input style="width: 90%" placeholder="请输入数据的属性名(必填)" vOn:blur={this.fnOnResNameBlur}
                      vModel_trim={config.resName}/>
            <ta-popover
              width="150"
              placement="top"
              trigger="hover"
              content="例如：codeList">
              <ta-icon slot="reference" type="question-circle" style="cursor: pointer;margin-left: 10px;"/>
            </ta-popover>
          </ta-label-con>
          <ta-label-con label="JSON对象" style="margin-bottom: 0">
            <ta-switch vModel={config.autoQs}/>
          </ta-label-con>
        </ta-tab-pane>}
        {/* 在远程数据之后渲染默认插槽 */}
        {
          this.$scopedSlots.default && this.$scopedSlots.default({
            config: config
          })
        }
      </ta-tabs>
    )
  }
}
