export default {
  async checkBeforeNext ({ dispatch, commit, state, }, { step, data, }) {
    if (step === 1) {
      commit({
        type: 'checkFeatList',
      })
    }
    if (step === 3) {
      if (state.formTemplate !== data) {
        await new Promise((resolve) => {
          window.vueBus.emit('checkSaveFormTemplate', data, resolve)
        })
      }
    }
    dispatch('changeCurrentStep', step)
  },
  changeCurrentStep ({ commit, }, currentStep) {
    commit({
      type: 'changeCurrentStep',
      currentStep,
    })
  },
  setTableName ({ commit, }, tableName) {
    commit({
      type: 'setTableName',
      tableName,
    })
  },
  setPrimaryKey ({ commit, }, primaryKey) {
    commit({
      type: 'setPrimaryKey',
      primaryKey,
    })
  },
  setTableColumns ({ commit, }, tableColumns) {
    commit({
      type: 'setTableColumns',
      tableColumns,
    })
  },
  addTableColumn ({ commit, }, column) {
    commit({
      type: 'addTableColumn',
      column,
    })
  },
  modifyTableColumn ({ commit, }, modifyData) {
    commit({
      type: 'modifyTableColumn',
      modifyData,
    })
  },
  removeTableColumn ({ commit, }, key) {
    commit({
      type: 'removeTableColumn',
      key,
    })
  },
  setChosenFeats ({ commit, }, chosenFeats) {
    commit({
      type: 'setChosenFeats',
      chosenFeats,
    })
  },
  addChosenFeats ({ state, getters, dispatch, commit, }, feat) {
    const modifyData = {}
    commit({
      type: 'addChosenFeats',
      feat,
    })
    modifyData[feat] = true
    if (feat === 'search') modifyData[feat] = [state.tableColumns[0].key]
    if (feat === 'filter') modifyData[feat] = [getters.collectionColumn[0].value]
    if (feat === 'size') modifyData[feat] = 'default'
    if (feat === 'pagination') modifyData[feat] = ['10', '20', '50', '100', '200']
    dispatch('modifyFeatData', modifyData)
  },
  removeChosenFeats ({ dispatch, commit, }, feat) {
    commit({
      type: 'removeChosenFeats',
      feat,
    })
    const modifyData = {}
    modifyData[feat] = null
    dispatch('modifyFeatData', modifyData)
  },
  setFeatData ({ commit, }, featData) {
    commit({
      type: 'setFeatData',
      featData,
    })
  },
  modifyFeatData ({ commit, }, modifyData) {
    commit({
      type: 'modifyFeatData',
      modifyData,
    })
  },
  setFormTemplate ({ commit, }, formTemplate) {
    commit({
      type: 'setFormTemplate',
      formTemplate,
    })
  },
  setApis ({ commit, }, apis) {
    commit({
      type: 'setApis',
      apis,
    })
  },
  modifyApis ({ commit, }, modifyData) {
    commit({
      type: 'modifyApis',
      modifyData,
    })
  },
}
