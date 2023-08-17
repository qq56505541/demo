import componentMixin from '../mixin/componentMixin'

export default {
  name: 'FormItemSingleInput',
  props: {
    item: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
    value: undefined,
    checked: undefined,
    modulePartId: String,
  },
  mixins: [componentMixin],
  render () {
    const { $listeners, $props, $attrs, $scopedSlots, } = this
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
    const singleInputProps = {
      props: {
        ...restProps,
        ...restItem,
        value,
        placeholder: restItem.placeholder || `请输入${restItem.label}`,
        defaultValue: value,
      },
      attrs: $attrs,
      on: $listeners,
      scopedSlots: $scopedSlots,
    }
    return (
      <ta-input {...singleInputProps}/>
    )
  },
}
