// "子表单内部的item的width" 配置项
export default {
  name: 'width-config',
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
      <ta-label-con label="宽度">
        <ta-input-number style="width: 100%" min={100} vModel={this.config.width} placeholder="请输入列宽度"/>
      </ta-label-con>
    )
  }
}
