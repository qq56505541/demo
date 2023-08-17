/**
 * 由于ant design for vue的input、textarea只有input事件，
 * 所以导致vModel_lazy监听不到change事件，因此添加了该组件，
 * 将textarea组件包了一层，监听原生change事件并抛出，以解决
 * 校验规则一直验证的问题，只在失去焦点的时候校验
 */
export default {
  name: 'validate-rules-config',
  model:{
    prop: 'value',
    event: 'change',
  },
  props: {
    value: String
  },
  data () {
    return {
      temp: this.value
    }
  },
  methods:{
    nativeChangeEvent(e){
      this.$emit('change', e.target.value)
    },
  },
  render () {
    return (
      <ta-textarea
        vModel={this.temp}
        vOn:change_native={this.nativeChangeEvent}
        placeholder="请填写数组格式的校验规则，例如：    [{ 'pattern': '[A-Za-z]+', 'message': '必须包含英文'}]"
        rows={4}/>
    )
  }
}
