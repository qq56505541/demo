// "所占栅格数" 配置项
export default {
  name: 'span-config',
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
      <ta-label-con label="所占栅格">
        <ta-input-number disabled={'divider' === this.config.type} style="width: 100%" min={1} max={24}
                         vModel={this.config.span} placeholder="请输入表单所占的栅格"/>
      </ta-label-con>
    )
  }
}
