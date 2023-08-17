const BASE_URL = 'message'
export default {

  queryAllTaOrg (data, callBack) {
    Base.submit(null, { url: BASE_URL + '/getOrgByAsync', data: data, }, {
      successCallback: (data) => callBack(data),
    })
  },
  queryBatchUserByOrgId (data, callBack) {
    Base.submit(null, { url: BASE_URL + '/queryEffectiveUser', data: data, }, {
      successCallback: (data) => callBack(data),
    })
  },

  // 查询用户角色
  queryUserList ({ orgId, userId, includeChild, pageSize, pageNum, searchVal, searchType, searchParam, }, successCall) {
    const param = {
      orgId: orgId,
      userId: userId,
      showChildUser: includeChild ? 1 : 0,
      pageSize: pageSize,
      pageNumber: pageNum,
      name: searchVal,
    }
    if (searchType) {
      param[searchType] = searchParam
    }
    Base.submit(null, { url: BASE_URL + '/queryEffectiveUser', data: param, }, {
      successCallback: (result) => successCall(result),
    })
  },

}
