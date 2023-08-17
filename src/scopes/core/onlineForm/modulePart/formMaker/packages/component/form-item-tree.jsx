import componentMixin from '../mixin/componentMixin'

export default {
  name: 'form-item-tree',
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

    let treeData = []
    if(dataType === 'static'){
      treeData = staticData || []
    }
    if(dataType === 'remote'){
      treeData = remoteData || []
    }
    const treeProps = {
      props: {
        ...restProps,
        ...restItem,
        options: this.realOptions,
        placeholder: restItem.placeholder || `请输入${restItem.label}`,
        defaultValue: this.transformValue2Array,
        value: this.transformValue2Array,
        treeData: treeData
      },
      attrs: $attrs,
      on: $listeners,
      scopedSlots: $scopedSlots,
    }
    return (
      <ta-tree-select {...treeProps}/>
    )
  }
}
