import componentMixin from '../mixin/componentMixin'

export default {
  name: 'form-item-switch',
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
  render () {
    const { $props, $listeners, $attrs, $scopedSlots } = this

    const {
      item: {
        type,
        icon,
        span,
        display,
        valueDefault,
        initialValue,
        ...restItem
      },
      value,
      checked,
      modulePartId,
      ...restProps
    } = $props

    const switchProps = {
      props: {
        ...restProps,
        ...restItem,
        defaultChecked: checked,
        checked,
      },
      attrs: $attrs,
      on: $listeners,
      scopedSlots: $scopedSlots
    }
    return (
      <ta-switch {...switchProps}/>
    )
  }
}
