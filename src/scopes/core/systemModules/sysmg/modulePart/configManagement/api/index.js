const BASE_URL = '/tasysconfig/taSysConfigRestService/'
export default {

  /* 更改配置 */
  updateSysConfig (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'updateSysConfig', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },

  querySysConfig (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'querySysConfig', data: data }, {
      successCallback: (data) => callBack(data)
    })

  },


  queryChild (data, callBack) {
    Base.submit(null, { url: BASE_URL + 'queryChild', data: data }, {
      successCallback: (data) => callBack(data)
    })

  },


  /* 删除配置 */
  deleteSysConfig (data, callBack) {
  Base.submit(null, {url: BASE_URL + 'deleteSysConfig', data: data}, {
    successCallback: (data) => callBack(data)
  })
},

  /* 刷新配置 */
  refreshSysConfig (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'refreshSysConfig', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },


  /* 刷新配置 */
  refreshOneSysConfig (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'refreshOneSysConfig', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },

// 新增配置
  addSysConfig (data, callBack) {
    Base.submit(null, {url:BASE_URL+ 'addSysConfig', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },


}
