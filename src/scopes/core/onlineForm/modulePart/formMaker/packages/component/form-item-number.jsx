import componentMixin from '../mixin/componentMixin'

export default {
  name: 'formItemNumber',
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
        min,
        max,
        step,
        precision,
        decimalSeparator,
        ...restItem
      },
      value,
      checked,
      modulePartId,
      ...restProps
    } = $props
    const numberProps = {
      props: {
        ...restProps,
        ...restItem,
        placeholder: restItem.placeholder || `请输入${restItem.label}`,
        defaultValue: value && value !== '' ? Number(value) : undefined,
        value: value && value !== '' ? Number(value) : undefined,
        min: parseInt(min) || Number.MIN_SAFE_INTEGER,
        max: parseInt(max) || Number.MAX_SAFE_INTEGER,
        step: parseFloat(step),
        precision: parseInt(precision),
        decimalSeparator: decimalSeparator === '' ? '.' : decimalSeparator,
      },
      attrs: $attrs,
      on: $listeners,
      scopedSlots: $scopedSlots,
    }
    return (
      <ta-input-number {...numberProps}/>
    )
  },
}
