// "必填" 配置项
export default {
  name: 'required-config',
  model: {
    prop: 'config',
    event: 'change',
  },
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  render () {
    return (
      <div>
        <ta-label-con label="是否必填">
          <ta-switch vModel={this.config.required}/>
        </ta-label-con>
        {
          this.config.required === true &&
          <ta-label-con label="必填提示">
            <ta-input vModel={this.config.message} placeholder="请输入必填提示信息"/>
          </ta-label-con>
        }
      </div>
    )
  }
}
