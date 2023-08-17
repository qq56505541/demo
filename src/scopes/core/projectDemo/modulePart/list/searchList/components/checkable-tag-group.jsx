import './checkable-tag-group.less'

export default {
  name: 'ta-checkable-tag-group',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    showAll: Boolean,
    tagStyle: Object,
    data: {
      type: Array,
      required: true,
    },
    value: Array,
  },
  data () {
    return {
      sValue: [],
    }
  },
  created () {
    this.sValue = this.value || []
  },
  methods: {
    handleTagChange (checked, item) {
      if (checked) {
        this.sValue.push(item.value)
      } else {
        this.sValue = this.sValue.filter(value => value !== item.value)
      }
      this.$emit('change', this.sValue)
      this.$emit('itemChange', checked, item)
    },
  },
  watch: {
    value (newVal) {
      this.sValue = newVal || []
    },
  },
  render () {
    const tags = this.data.map(item => {
      const tagProps = {
        props: {
          checked: this.sValue.includes(item.value),
        },
        on: {
          change: (checked) => this.handleTagChange(checked, item),
        },
        style: this.tagStyle,
      }
      return (
        <ta-checkable-tag {...tagProps}>{item.label}</ta-checkable-tag>
      )
    })

    let allTag = null
    if (this.showAll) {
      const allTagProps = {
        props: {
          checked: this.sValue.length === this.data.length,
        },
        on: {
          change: (checked) => {
            if (checked) {
              this.sValue = this.data.map(item => item.value)
            } else {
              this.sValue = []
            }
            this.$emit('change', this.sValue)
            this.$emit('itemChange', checked, 'allTag')
          },
        },
        style: this.tagStyle,
      }
      allTag = <ta-checkable-tag {...allTagProps}>全部</ta-checkable-tag>
    }

    return (
      <div class="ant-checkable-tag-group">
        {allTag}
        {tags}
      </div>
    )
  },
}
