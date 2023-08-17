import routesContainer from '@/common/components/routesContainer'

//模块part 声明导入
import modulePart1 from '../modulePart/modulePart1/routes'
import formTemplate from '../modulePart/formTemplate/routes'
import formMaker from '../modulePart/formMaker/routes'

const innerRoutes = [
  ...modulePart1,
  ...formTemplate,
  ...formMaker
]
//导入路由声明
export default [
  {
    path: '/',
    component: routesContainer,
    children: innerRoutes.map((item) => ({
        ...item,
      })
    ),
  },
]
