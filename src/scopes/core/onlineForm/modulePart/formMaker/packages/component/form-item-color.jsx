import componentMixin from '../mixin/componentMixin'

export default {
  name: 'form-item-color',
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
  render(){
    const { $props, $listeners, $attrs, $scopedSlots } = this

    const {
      item: {
        type,
        icon,
        span,
        display,
        initialValue,
        ...restItem
      },
      value,
      checked,
      modulePartId,
      ...restProps
    } = $props
    const colorProps = {
      props: {
        ...restProps,
        ...restItem,
        defaultValue: value,
        value: value,
      },
      attrs: $attrs,
      on: $listeners,
      scopedSlots: $scopedSlots,
    }

    return (
      <ta-color-picker {...colorProps}/>
    )
  }
}
