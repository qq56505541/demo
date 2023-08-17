import componentMixin from '../mixin/componentMixin'

export default {
  name: 'form-item-multi-input',
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
  render (h) {
    const { $props, $listeners, $attrs, $scopedSlots } = this

    const {
      item: {
        type,
        icon,
        span,
        display,
        rows,
        initialValue,
        ...restItem
      },
      value,
      checked,
      modulePartId,
      ...restProps
    } = $props
    const multiInputProps = {
      props: {
        ...restProps,
        ...restItem,
        value,
        placeholder: restItem.placeholder || `请输入${restItem.label}`,
        defaultValue: value,
      },
      attrs: {
        ...$attrs,
        rows
      },
      on: $listeners,
      scopedSlots: $scopedSlots,
    }
    return (
      <ta-textarea {...multiInputProps}/>
    )
  }
}
