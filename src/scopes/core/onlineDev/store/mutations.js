import { merge, } from '@yh/ta-utils'

export default {
  changeCurrentStep (state, payload) {
    state.currentStep = payload.currentStep
  },
  setTableName (state, payload) {
    state.tableName = payload.tableName
  },
  setPrimaryKey (state, payload) {
    state.primaryKey = payload.primaryKey
  },
  setTableColumns (state, payload) {
    state.tableColumns = payload.tableColumns
  },
  addTableColumn (state, payload) {
    state.tableColumns.push(payload.column)
  },
  modifyTableColumn (state, payload) {
    state.tableColumns = state.tableColumns.map(item => {
      if (item.key === payload.modifyData.key) {
        let flag = false
        Object.entries(payload.modifyData.data).map(([key, value]) => {
          if (value === null) {
            delete item[key]
            flag = true
          }
        })
        if (flag) {
          return item
        }
        item = merge(item, payload.modifyData.data)
      }
      return item
    })
  },
  removeTableColumn (state, payload) {
    state.tableColumns = state.tableColumns.filter(item => item.key !== payload.key)
  },
  checkFeatList (state) {
    const filter = state.featList.filter(item => item.value === 'filter')[0]
    filter.disabled = this.getters['design/collectionColumn'].length === 0
    filter.title = filter.disabled && '选中字段中没有字段设置字典类型，故无法使用过滤'

    // const scrollX = state.featList.filter(item => item.value === 'scrollX')[0]
    // scrollX.disabled = this.getters['design/fixedColumn'].length === 0
    // scrollX.title = filter.disabled && '选中字段中没有字段为固定列'
    // console.log(this.getters['design/fixedColumn'])
  },
  setChosenFeats (state, payload) {
    const removeList = payload.chosenFeats.filter(item => !state.chosenFeats.includes(item))
    removeList.map(item => {
      state.featData[item] = null
    })
    state.chosenFeats = payload.chosenFeats
  },
  addChosenFeats (state, payload) {
    state.chosenFeats.push(payload.feat)
  },
  removeChosenFeats (state, payload) {
    state.chosenFeats = state.chosenFeats.filter(item => item !== payload.feat)
    state.featData[payload.feat] = null
  },
  setFeatData (state, payload) {
    state.featData = payload.featData
  },
  modifyFeatData (state, payload) {
    Object.keys(payload.modifyData).map(item => {
      state.featData[item] = payload.modifyData[item]
    })
  },
  setFormTemplate (state, payload) {
    state.formTemplate = payload.formTemplate
  },
  setApis (state, payload) {
    state.apis = payload.apis
  },
  modifyApis (state, payload) {
    Object.keys(payload.modifyData).map(item => {
      state.apis[item] = payload.modifyData[item]
    })
  },
}
