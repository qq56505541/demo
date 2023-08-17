import routesContainer from '@/common/components/routesContainer'

// 模块part 声明导入
import dashboard from '../modulePart/dashboard/routes'
import form from '../modulePart/form/routes'
import list from '../modulePart/list/routes'
import detail from '../modulePart/detail/routes'
import other from '../modulePart/other/routes'
import bigdataTest from '../modulePart/bigdataTest/routes'

const innerRoutes = [
  ...dashboard,
  ...form,
  ...list,
  ...detail,
  ...other,
  ...bigdataTest
]
// 导入路由声明
export default [
  {
    path: '/',
    component: routesContainer,
    children: innerRoutes.map((item) => ({
      ...item,
    })
    ),
  }
]
