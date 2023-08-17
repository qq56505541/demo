import componentMixin from '../mixin/componentMixin'

export default {
  name: 'form-item-date',
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
        validNowTime,
        format,
        initialValue,
        ...restItem
      },
      value,
      checked,
      modulePartId,
      ...restProps
    } = $props
    const dateProps = {
      props: {
        ...restProps,
        ...restItem,
        defaultValue: value && value.length !==0 ? this.transformValue2Moment : null,
        value: value && value.length !==0 ? this.transformValue2Moment : null,
        placeholder: restItem.placeholder || `请输入${restItem.label}`,
        format: format.length === 0 ? 'YYYY-MM-DD' : format,
        validNowTime: validNowTime === '-1' ? '' : validNowTime
      },
      attrs: $attrs,
      on: $listeners,
      scopedSlots: $scopedSlots,
    }
    return (
      <ta-date-picker {...dateProps}></ta-date-picker>
    )
  }
}
