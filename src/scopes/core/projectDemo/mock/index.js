import Mock from 'mockjs'
import { urlParam2Obj, } from './util'
import { createWebStorage, } from '@yh/ta-utils'

const cryptInfoStorage = createWebStorage('Ta$cacheCryptInfo', { isLocal: true, })
const cryptInfo = cryptInfoStorage.get('Ta$cacheCryptInfo')
const oldWhiteList = cryptInfo.reqUrlWhiteList
oldWhiteList.push('/http/mock/projectDemo/**')
cryptInfoStorage.set('Ta$cacheCryptInfo', cryptInfo)

Mock.XHR.prototype.proxy_open = Mock.XHR.prototype.open
Mock.XHR.prototype.open = function (method, url, async, username, password) {
  this.proxy_open(method, url, async = true, username, password) // 将所有mock请求设置为异步
}

Mock.XHR.prototype.withCredentials = true
Mock.setup({
  timeout: '200-600',
})

let configArray = []

const files = require.context('.', true, /\.js$/)
files.keys().forEach((key) => {
  if (key !== './index.js' && key !== './util.js') configArray = configArray.concat(files(key).default)
})

configArray.forEach((item) => {
  for (const [path, target] of Object.entries(item)) {
    const protocol = path.split('|')
    Mock.mock(new RegExp('^http/mock/' + protocol[1]), protocol[0], (options) => {
      const res = target(options)
      const param = urlParam2Obj(options)
      console.log('================== Mock Info ==================')
      console.log('Request Info: ')
      console.log(`  * Method: ${options.type}`)
      console.log(`  * URL: ${options.url}`)
      console.log('  * Body: ')
      console.log(param)
      console.log('Response Body: ')
      console.log(res)
      console.log('===================== END =====================')
      return res
    })
  }
})
