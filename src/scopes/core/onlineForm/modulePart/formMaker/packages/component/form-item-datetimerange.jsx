import componentMixin from '../mixin/componentMixin'

export default {
  name: 'form-item-datetimerange',
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
    const dateTimeRangeProps = {
      props: {
        ...restProps,
        ...restItem,
        defaultValue: value && value.length !==0 ? this.transformValue2MomentArray : null,
        value: value && value.length !==0 ? this.transformValue2MomentArray : null,
        placeholder: restItem.placeholder ? [restItem.placeholder, restItem.placeholder] : ['请输入开始时间', '请输入结束时间'],
        format: format.length === 0 ? 'YYYY-MM-DD' : format,
        validNowTime: validNowTime === '-1' ? '' : validNowTime,
        showTime: true
      },
      attrs: $attrs,
      on: $listeners,
      scopedSlots: $scopedSlots,
    }
    return (
      <ta-range-picker {...dateTimeRangeProps}/>
    )
  }
}
