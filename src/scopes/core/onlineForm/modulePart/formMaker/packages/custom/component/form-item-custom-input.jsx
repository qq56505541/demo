import componentMixin from '../../mixin/componentMixin'

export default {
  name: 'form-item-custom-input',
  props: {
    item: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    value: undefined,
    checked: undefined,
    modulePartId: String
  },
  mixins: [componentMixin],
  data () {
    return {}
  },
  methods: {
    fnOnChange(e){
      this.$emit('change', e)
    },
    fnOnBlur(e){
      this.$emit('blur', e)
    },
  },
  render () {
    return (
      <ta-input
        placeholder={this.item.placeholder || `请输入${this.item.label}`}
        disabled={this.item.disabled}
        default-value={this.value}
        vOn:change={this.fnOnChange}
        vOn:blur={this.fnOnBlur}
      />
    )
  }
}
