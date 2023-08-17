import componentMixin from '../mixin/componentMixin'

export default {
  name: 'form-item-cascader',
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
  computed: {
    realOptions: {
      get: function () {
        if(this.item.dataType === 'static') return this.item.staticData
        if(this.item.dataType === 'remote') return this.item.remoteData
      },
      set: function () {

      }
    }
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
        dataType,
        staticData,
        remoteData,
        initialValue,
        ...restItem
      },
      value,
      checked,
      modulePartId,
      ...restProps
    } = $props
    const cascaderProps = {
      props: {
        ...restProps,
        ...restItem,
        options: this.realOptions,
        placeholder: restItem.placeholder || `请输入${restItem.label}`,
        defaultValue: this.transformValue2Array,
        value: this.transformValue2Array,
      },
      attrs: $attrs,
      on: $listeners,
      scopedSlots: $scopedSlots,
    }

    return (
      <ta-cascader {...cascaderProps}/>
    )
  }
}
