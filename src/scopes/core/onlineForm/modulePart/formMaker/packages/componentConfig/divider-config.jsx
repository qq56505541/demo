import BaseConfig from './commonComponent/base-config'

export default {
  name: 'divider-config',
  components: { BaseConfig },
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
  data () {
    return {
      defaultConfigNameList: [
        'label',
        'span'
      ]
    }
  },
  render () {
    return (
      <base-config config={this.config} configNameList={this.defaultConfigNameList}/>
    )
  }
}
