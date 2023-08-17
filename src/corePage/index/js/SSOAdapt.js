// 单点适配
const accessToken = TaUtils.getCookie('TA-JTOKEN')
const refreshToken = TaUtils.getCookie('TA-RJTOKEN')
if (accessToken !== null && accessToken !== undefined && accessToken !== '') {
  TaUtils.setCookie(faceConfig?.basePath + 'TA-JTOKEN', accessToken, 0, '/')
}
if (refreshToken !== null && accessToken !== undefined && refreshToken !== '') {
  TaUtils.setCookie(faceConfig?.basePath + 'TA-RJTOKEN', refreshToken, 0, '/')
}
