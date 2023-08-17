import componentMixin from '../mixin/componentMixin'

export default {
  name: 'form-item-radio',
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
      const radioProps = {
        props: {
          ...restProps,
          ...restItem,
          defaultValue: value,
          value,
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
        <ta-radio
          key={item.value}
          value={item.value}>{item.label}
        </ta-radio>
      ))
      return (
        <ta-radio-group {...radioProps}>
          {children}
        </ta-radio-group>
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
      const radioProps = {
        props: {
          ...restProps,
          ...restItem,
          defaultValue: value,
          value,
        },
        attrs: $attrs,
        on: $listeners,
        scopedSlots: $scopedSlots,
      }

      return (
        <ta-radio-group {...radioProps}/>
      )
    }
  },
  render (){
    if(this.item.dataType === 'dict'){
      return this.collectionRadioGroup()
    }

    if(['static', 'remote'].includes(this.item.dataType)){
      return this.normalRadioGroup()
    }
  }
}
