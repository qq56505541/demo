import routesContainer from '@/common/components/routesContainer'

// 模块part 声明导入
import onlinePage from '../modulePart/onlinePage/routes'
import onlineDesign from '../modulePart/onlineDesign/routes'

const innerRoutes = [
  ...onlinePage,
  ...onlineDesign
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
