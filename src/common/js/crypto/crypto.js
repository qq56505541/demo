import cryptoUtil from '@yh/ta-utils/crypto'
import { cryptoFn, } from '@yh/ta404-ui/es/utils/js/cryptoFn'

// 初始化加密信息并存储 flag:是否强制刷新
async function initCrypto (flag) {
  let cacheCryptInfo = TaUtils.webStorage.getStorage('Ta$cacheCryptInfo', 'Ta$cacheCryptInfo', { isLocal: true, })
  if (flag !== true && cacheCryptInfo !== null && JSON.stringify(cacheCryptInfo) !== '{}') {
    return false
  }
  const fn1 = async function (data) {
    const cryptInfo = data?.data?.cryptoInfo
    const len = cryptInfo.randomKeyLength || 16
    // 生成秘钥
    cryptInfo.randomKey = cryptoUtil.creat64Key(len)
    // 存储秘钥
    cacheCryptInfo = TaUtils.webStorage.createWebStorage('Ta$cacheCryptInfo', { isLocal: true, })
    cacheCryptInfo.set('Ta$cacheCryptInfo', cryptInfo)
    // 1. 如果加密级别大于1  2.如果提供的秘钥长度大于等于16才  才会进入加密流程
    if (cryptInfo?.reqDataLevel >= 1 && cryptInfo?.randomKeyLength >= 16) {
      // 使用非对称加密key并提交
      const enckey = cryptoFn(cryptInfo.asymmetricAlgo, cryptInfo.randomKey)
      await Base.submit(null, {
        url: 'indexRestService/getToken',
        data: { key: enckey, },
      }).then((data) => {
        if (data?.data?.token) {
          TaUtils.setCookie('Client-ID', data.data.token, 0, '/')
        }
      })
    }
  }
  // 获取加密信息
  await Base.submit(null, {
    url: 'indexRestService/getCryptoInfo',
    reqDataLevel: false,
  }).then(async (data) => {
    await fn1(data)
  })
}

function checkLogin (ck) {
  Base.submit(null, {
    url: 'indexRestService/defaultOpen',
  }).then(async (data) => {
    await initCrypto()
    ck()
  })
}

export {
  initCrypto,
  checkLogin,
}
