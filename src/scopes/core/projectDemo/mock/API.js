import { urlParam2Obj, successRes, } from './util'
import Mock from 'mockjs'

export default {
  'post|projectDemo/demo': (option) => {
    const res = successRes()
    res.data.sessionPasswordErrorNumber = 0
    return res
  },
  'post|projectDemo/searchTableQuery': (option) => {
    const { pageNumber, pageSize, } = urlParam2Obj(option)
    const pageStart = (Number.parseFloat(pageNumber) - 1) * Number.parseFloat(pageSize)
    let pageCount = 0
    if (40 - pageStart + 1 + pageSize < 0) {
      pageCount = 40 - pageStart + 1
    } else {
      pageCount = Number.parseFloat(pageSize)
    }
    const res = successRes()
    res.data.pageBean = {
      currentSize: pageCount,
      pageNum: Number.parseFloat(pageNumber),
      pageSize: Number.parseFloat(pageSize),
      pages: Math.ceil(40 / Number.parseFloat(pageSize)),
      total: 40,
    }
    res.data.pageBean.list = Array.from({ length: pageCount, }).map(() => {
      const key = Mock.mock('@increment')
      return Mock.mock({
        key: key,
        id: key,
        no: 'No ' + (key + 1),
        description: Mock.mock('@csentence'),
        callNo: key,
        'status|1-3': 1,
        updatedAt: Mock.mock('@date'),
      })
    })
    return res
  },
  'post|projectDemo/stepForm/submitAll': (option) => {
    const res = successRes()
    res.data.userName = '张三'
    return res
  },
  'post|projectDemo/stepForm/step1': (option) => {
    const { getAccountName, } = urlParam2Obj(option)
    const res = successRes()
    if (getAccountName === 'admin') {
      res.data.validate = true
    } else {
      res.data.validate = false
    }
    return res
  },
  'post|projectDemo/stepForm/step2': (option) => {
    const { payPwd, } = urlParam2Obj(option)
    const res = successRes()
    if (payPwd === '111111') {
      res.data.validate = true
    } else {
      res.data.validate = false
    }
    return res
  },
  'post|projectDemo/stepForm/step3': (option) => {
    const { answer1, } = urlParam2Obj(option)
    const res = successRes()
    if (answer1 === '1') {
      res.data.validate = true
    } else {
      res.data.validate = false
    }
    return res
  },
  'post|projectDemo/list/article': (option) => {
    const res = successRes()
    let { count, } = urlParam2Obj(option)
    if (!count) {
      count = 5
    }
    res.data.list = Array.from({ length: count, }).map((_, index) => {
      const key = Mock.mock('@increment')
      return Mock.mock({
        id: key,
        avatar: `https://picsum.photos/400/400?random=${index}`,
        owner: Mock.mock('@cname'),
        content: Mock.mock('@csentence'),
        'star|1-1000': 1,
        'percent|1-1000': 1,
        'like|1-1000': 1,
        'message|1-1000': 1,
        description: Mock.mock('@csentence'),
        href: 'http://118.112.188.108:9071/docs/infos/vue/introduce-cn',
        'title|1': [
          'Alipay',
          'Angular',
          'Ant Design',
          'Ant Design Pro',
          'Bootstrap',
          'React',
          'Vue',
          'Webpack'
        ],
        updatedAt: Mock.mock('@date'),
        members: [
          {
            avatar: 'https://picsum.photos/seed/1/400/400?random=1',
            name: '曲丽丽',
            id: 'member1',
          },
          {
            avatar: 'https://picsum.photos/seed/2/400/400?random=1',
            name: '王昭君',
            id: 'member2',
          },
          {
            avatar: 'https://picsum.photos/seed/3/400/400?random=1',
            name: '董娜娜',
            id: 'member3',
          }
        ],
        'activeUser|100000-200000': 1,
        'newUser|1000-2000': 1,
        cover: `https://picsum.photos/400/400?random=${index}`,
      })
    })
    return res
  },
  'post|projectDemo/formComplex/submitAll': () => {
    return successRes()
  },
  'post|projectDemo/formComplex/queryFormData': () => {
    const res = successRes()
    res.data = {
      dataArr: ['Burns', 'Downing', 'Wall'],
      plainOptions: [{ label: '苹果', value: '0', }, { label: '梨', value: '1', }, { label: '香蕉', value: '2', }],
      options: [{ value: 'zhejiang', label: '浙江', children: [{ value: 'hangzhou', label: '杭州', children: [{ value: 'xihu', label: '西湖', }], }], }, { value: 'jiangsu', label: '江苏', children: [{ value: 'nanjing', label: '南京', children: [{ value: 'zhonghuamen', label: '中华门', }], }], }],
      dataSource: [{ id: '1', name: '张三1', sex: '男', }, { id: '2', name: '张三2', sex: '男', }, { id: '3', name: '张三3', sex: '男', }, { id: '4', name: '张三4', sex: '男', }, { id: '5', name: '张三5', sex: '男', }, { id: '6', name: '张三6', sex: '男', }, { id: '7', name: '张三7', sex: '男', }, { id: '8', name: '张三8', sex: '男', }, { id: '9', name: '张三9', sex: '男', }, { id: '0', name: '张三10', sex: '男', }, { id: '11', name: '张三11', sex: '男', }, { id: '12', name: '张三12', sex: '男', }, { id: '13', name: '张三13', sex: '男', }],
    }
    return res
  },
  'post|projectDemo/formComplex/getUserInfo': () => {
    const res = successRes()
    res.data.result = Array.from({ length: 10, }).map((_, i) => {
      return { userId: i + '-' + i, name: '张' + '-' + i + '-' + i, sex: i % 3, namePath: '顶级组织/研发中心', mobile: '13111223344', loginId: 'XXXX', }
    })
    return res
  },
  'post|projectDemo/bigdataTest/treeSelect': (option) => {
    const res = successRes()
    const { orgId, dataLength, } = urlParam2Obj(option)
    if (!orgId) {
      res.data = Array.from({ length: dataLength, }).map((_, i) => {
        return { label: `节点-${i}`, value: `节点-${i}`, key: `${i}`, children: [], }
      })
    } else {
      const n = orgId.split('-').length - 1
      if (n < 2) { // 第三级为叶子节点
        res.data = Array.from({ length: dataLength, }).map((_, i) => {
          return { label: `子节点-${orgId}-${i}`, value: `子节点-${orgId}-${i}`, key: `子节点-${orgId}-${i}`, children: [], }
        })
      } else {
        res.data = Array.from({ length: dataLength, }).map((_, i) => {
          return { label: `子节点-${orgId}-${i}`, value: `子节点-${orgId}-${i}`, key: `子节点-${orgId}-${i}`, childNum: 0, }
        })
      }
    }
    return res
  },
  'post|projectDemo/bigdataTest/cascaderTest': (option) => {
    const res = successRes()
    const { orgId, dataLength, } = urlParam2Obj(option)
    res.data = Array.from({ length: dataLength, }).map((_, i) => {
      return { label: `节点${orgId}-${i}`, value: `节点${orgId}-${i}`, children: [], }
    })
    return res
  },
  'post|projectDemo/bigdataTest/treeTest': (option) => {
    const res = successRes()
    const { orgId, dataLength, } = urlParam2Obj(option)
    res.data = Array.from({ length: dataLength, }).map((_, i) => {
      return { title: `节点${orgId}-${i}`, key: `${orgId}-${i}`, children: [], }
    })
    return res
  },
  'post|projectDemo/selectData': (option) => {
    const res = successRes()
    const { length, } = urlParam2Obj(option)
    res.data.list = Array.from({ length, }).map((_, i) => ({
      value: i + 1,
      label: `第${i + 1}条数据`,
    }))
    return res
  },
}
