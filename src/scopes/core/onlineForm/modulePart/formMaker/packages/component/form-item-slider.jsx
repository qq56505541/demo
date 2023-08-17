import componentMixin from '../mixin/componentMixin'

export default {
  name: 'form-item-slider',
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
    const { $listeners, $props, $attrs, $scopedSlots } = this
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
        range,
        ...restItem
      },
      value,
      checked,
      modulePartId,
      ...restProps
    } = $props
    const sliderProps = {
      props: {
        ...restProps,
        ...restItem,
        placeholder: restItem.placeholder || `请输入${restItem.label}`,
        range,
        defaultValue: range ? this.transformValue2Array : parseInt(value),
        value: range ? this.transformValue2Array : parseInt(value),
        min: parseInt(min),
        max: parseInt(max),
        step: parseFloat(step),
      },
      attrs: $attrs,
      on: $listeners,
      scopedSlots: $scopedSlots
    }
    return (
      <ta-slider {...sliderProps}/>
    )
  }
}
