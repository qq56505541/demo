import componentMixin from '../mixin/componentMixin'

export default {
  name: 'form-item-checkbox',
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
    normalRadioGroup(){
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
      const checkboxProps = {
        props: {
          ...restProps,
          ...restItem,
          defaultValue: this.transformValue2Array,
          value: this.transformValue2Array,
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
        <ta-checkbox
          key={item.value}
          value={item.value}>{item.label}
        </ta-checkbox>
      ))
      return (
        <ta-checkbox-group {...checkboxProps}>
          {children}
        </ta-checkbox-group>
      )
    },
    collectionRadioGroup(){
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
      const checkboxProps = {
        props: {
          ...restProps,
          ...restItem,
          defaultValue: this.transformValue2Array,
          value: this.transformValue2Array,
        },
        attrs: $attrs,
        on: $listeners,
        scopedSlots: $scopedSlots,
      }

      return (
        <ta-checkbox-group {...checkboxProps}/>
      )
    }
  },
  render(){
    if(this.item.dataType === 'dict'){
      return this.collectionRadioGroup()
    }

    if(['static', 'remote'].includes(this.item.dataType)){
      return this.normalRadioGroup()
    }
  }
}
