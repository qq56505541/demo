import componentMixin from '../mixin/componentMixin'

export default {
  name: 'form-item-rate',
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
  render() {
    const { $listeners, $props, $attrs, $scopedSlots } = this
    const {
      item: {
        type,
        icon,
        span,
        display,
        initialValue,
        count,
        ...restItem
      },
      value,
      checked,
      modulePartId,
      ...restProps
    } = $props
    const rateProps = {
      props: {
        ...restProps,
        ...restItem,
        defaultValue: parseFloat(value),
        value: parseFloat(value),
        count: parseInt(count) || 5,
      },
      attrs: $attrs,
      on: $listeners,
      scopedSlots: $scopedSlots
    }
    return (
      <ta-rate {...rateProps}/>
    )
  }
}
