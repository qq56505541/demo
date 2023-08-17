export default {
  name: 'slot-config',
  model: {
    prop: 'config',
    event: 'change'
  },
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  render () {
    return (
      <div style="margin-top: 50px">
        <ta-label-con label="插槽名称">
          <ta-input vModel={this.config.slotName}/>
        </ta-label-con>
        <div style="color:red">
          <ol style="line-height:30px">
            <li>必须填入插槽名</li>
            <li>同一个模板内不可重复</li>
            <li>插槽中的内容如果是表单则需要设置span，来表示占多少列</li>
          </ol>
        </div>
      </div>
    )
  }
}
