import componentMixin from '../mixin/componentMixin'

export default {
  name: 'form-item-select',
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
  methods: {
    normalSelect() {
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

      const selectProps = {
        props: {
          ...restProps,
          ...restItem,
          defaultValue: this.transformValue2Array,
          value: this.transformValue2Array,
          placeholder: restItem.placeholder || `请选择${restItem.label}`,
        },
        attrs: $attrs,
        on: $listeners,
        scopedSlots: $scopedSlots,
      }

      let dataSource = []
      if(dataType === 'static'){
        dataSource = staticData || []
      }
      if(dataType === 'remote') {
        dataSource = remoteData || []
      }
      const children = dataSource.map(item => (
        <ta-select-option
          key={item.value}
          value={item.value}
        >
          {item.label}
        </ta-select-option>
      ))
      return (
        <ta-select {...selectProps}>
          {children}
        </ta-select>
      )
    },
    collectionSelect() {
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
          ...restItem
        },
        value,
        checked,
        modulePartId,
        ...restProps
      } = $props
      const selectProps = {
        props: {
          ...restProps,
          ...restItem,
          defaultValue: this.transformValue2Array,
          value: this.transformValue2Array,
          placeholder: restItem.placeholder || `请选择${restItem.label}`
        },
        attrs: $attrs,
        on: $listeners,
        scopedSlots: $scopedSlots,
      }

      return (
        <ta-select {...selectProps}/>
      )
    }
  },
  render(){
    if(this.item.dataType === 'dict'){
      return this.collectionSelect()
    }

    if(['static', 'remote'].includes(this.item.dataType)){
      return this.normalSelect()
    }
  }
}
