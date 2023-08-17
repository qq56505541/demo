import moment from 'moment'

export default {
  data () {
    return {
      moment: moment,
    }
  },
  computed: {
    // 将ta-form-item设置进来的value转换为array
    transformValue2Array () {
      let res = undefined
      if(this.value){
        if(this.item.type === 'slider' && !Array.isArray(this.value)){
          if(this.value === '') {
            res = [this.item.min, this.item.max]
          }else {
            res = this.value.split(',').map(item => parseInt(item))
          }
          this.$emit('change', res)
        }else {
          if(Array.isArray(this.value)){
            res = this.value
          }else {
            res = this.value.split(',')
            this.$emit('change', res)
          }
        }
      } else {
        res = []
        this.$emit('change', res)
      }
      return res
    },
    // 将ta-form-item设置进来的value转换为moment
    transformValue2Moment(){
      if(this.value instanceof moment) return this.value
      let value = null
      if(this.item.type === 'time'){
        value = this.moment(this.value, this.item.format)
      } else {
        value = this.moment(this.value)
      }
      this.$emit('change', value)
      return value
    },
    // 将ta-form-item设置进来的value转换为moment数组
    transformValue2MomentArray(){
      let momentList = []
      if(Array.isArray(this.value)){
        momentList = this.value.map(item => this.moment(item))
      }else {
        momentList = this.value.split(',').map(item => this.moment(item))
        this.$emit('change', momentList)
      }
      return momentList
    }
  },
  mounted () {
    // 请求当前表单项的数据
    this.fnQueryData()
  },
  methods: {
    // 递归查找属性
    getData (obj, dataName) {
      let res = undefined
      const tempArr = Object.getOwnPropertyNames(obj)
      if (tempArr.includes(dataName)) {
        return obj[dataName]
      } else {
        for (let i = 0; i < tempArr.length; i++) {
          if (res) return res
          res =  this.getData(obj[tempArr[i]], dataName)
          if (res) return res
        }
      }
    },
    // 请求数据
    fnQueryData () {
      if (this.item.dataType === 'remote' && !this.item.remoteData) {
        Base.submit(null, {
          url: this.item.url,
          data: JSON.parse(this.item.params.replace(/'/g,'"').replace(/&#x27;/g, '"')) || {},
        }).then(res => {
          this.item.remoteData = this.getData(res, this.item.resName)
          this.$forceUpdate()
        })
      }
    }
  }
}
