export default {
  nextDisabled (state) {
    if (state.currentStep === 0) {
      return !state.tableColumns.length
    }
    return false
  },
  tableColumnKeys (state) {
    return state.tableColumns.map(item => item.key)
  },
  collectionColumn (state) {
    return state.tableColumns.filter(item => item.collectionType).map(item => {
      return {
        value: item.key,
        label: item.key,
      }
    })
  },
  fixedColumn (state) {
    return state.tableColumns.filter(item => item.fixed)
  },
}
