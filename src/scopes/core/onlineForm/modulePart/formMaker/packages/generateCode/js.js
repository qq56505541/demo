import jsBeautify from 'js-beautify'
import { beautifierConf, } from './utils'

const buildCreated = (request) => {
  return request.map(item => {
    return `Base.submit(null, {
      url: ${item.url},
      data: ${JSON.parse(item.params.replace(/'/g, '"').replace(/&#x27;/g, '"')) || {}},
    }).then(res => {
      this.dataSource_${item.fieldDecoratorId} = this.getData(res, ${item.resName})
    })
    `
  })
}

const buildData = (data) => {
  return data.map(item => {
    if (typeof item === 'object') {
      return `${item.name}: ${JSON.stringify(item.value).replace(/'/g, '\\\'').replace(/"/g, '\'')},`
    }
    return `${item}: [],`
  })
}

const buildMethods = (methods) => {
  return methods.map(item => {
    if (item === 'dynamicAddItem') {
      return `dynamicAddItem(dataSourceName){
        const record = {}
        record.addItem = this[dataSourceName].length + 1
        this[dataSourceName].push(record)
        this.$forceUpdate()
      },`
    }
    if (item === 'dynamicDeleteItem') {
      return `dynamicDeleteItem(dataSourceName, recordIndex){
        this[dataSourceName].splice(recordIndex, 1)
        this.$forceUpdate()
      },`
    }
    if (item === 'getData') {
      return `getData (obj, dataName) {
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
      },`
    }
    if (item === 'handleSubmit') {
      return `handleSubmit () {
        
      },`
    }
    if (item === 'handleReset') {
      return `handleReset () {
        this.form.resetFields()
      },`
    }
  })
}

const mapItem = (columns, formData) => {
  const request = []
  const data = []
  const methods = []

  function processData (item) {
    if (item.dataType === 'remote') {
      data.push(`dataSource_${item.fieldDecoratorId}`)
      request.push({
        id: item.fieldDecoratorId,
        url: item.url,
        params: item.params,
        resName: item.resName,
      })
      if (!methods.includes('getData')) methods.push('getData')
    }

    if (item.dataType === 'static') {
      data.push({
        name: `dataSource_${item.fieldDecoratorId}`,
        value: item.staticData,
      })
    }
  }

  columns.map(item => {
    if (item.type === 'dynamic') {
      data.push(`dataSource_${item.fieldDecoratorId}`)
      if (!methods.includes('dynamicAddItem')) methods.push('dynamicAddItem')
      if (!methods.includes('dynamicDeleteItem')) methods.push('dynamicDeleteItem')
      item.children.column.map(processData)
    }

    processData(item)
  })
  if (formData.showButton) {
    methods.push('handleSubmit')
    methods.push('handleReset')
  }

  return {
    created: buildCreated(request).join(''),
    data: buildData(data).join(''),
    methods: buildMethods(methods).join(''),
  }
}

export const vueScript = (formData) => {
  const {
    created,
    data,
    methods,
  } = mapItem(formData.formColumns, formData)

  const js = jsBeautify.js(`{
  data () {
    return {
      ${data}
    }
  },
  created () {
    ${created}
  },
  methods: {
    ${methods}
  },
}`, beautifierConf.js)

  return `
<script>
export default ${js}
</script>`
}
