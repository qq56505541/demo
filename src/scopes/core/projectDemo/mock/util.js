import uuid from 'uuid/v4'

const successRes = () => ({
  code: 200,
  data: {},
  errors: [],
  requestId: uuid(),
  serviceSuccess: true,
  redirectUrl: null,
})

const errorRes = () => ({
  code: 500,
  data: {},
  errors: [{
    errorCode: '500',
    msg: '出现了点小意外,请稍后再试或联系管理员,错误ID:mock',
  }],
  requestId: uuid(),
  serviceSuccess: false,
})

const urlParam2Obj = (param) => {
  const string = decodeURIComponent(param.body).split('&')
  const res = {}
  for (let i = 0; i < string.length; i++) {
    const str = string[i].split('=')
    if (str[0] !== '') {
      res[str[0]] = str[1]
    }
  }
  return res
}

export default {
  urlParam2Obj,
  successRes,
  errorRes,
}

export {
  urlParam2Obj,
  successRes,
  errorRes,
}
