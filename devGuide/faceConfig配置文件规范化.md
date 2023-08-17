## faceConfig配置文件规范化

---

+ 从`1.5.0`开始,`faceConfig.js`仅用于存放运行时配置,其他编译期配置移动到`.env`或`webpackCommonConfig.js`文件中

下面按照3种环境以及通用配置进行编译期配置梳理
1. `env`文件配置
    + 通用配置
        + VUE_APP_PUBLIC_PATH
      
        原`faceConfig.context`,用于设置dev启动后的上下文设置或打包部署后的上下文
        + VUE_APP_BASE_PATH
      
        原`faceConfig.basePath`,用于提供Base.submit的基础访问路径,在dev启动时,这个值可以设置为类似`/ta404`的值,也可以设置为实际的后端接口地址
      
        **注意:**
        1. 若这个配置为实际的后端接口地址,那么在访问前端页面时,与后端的请求可能会跨域,此时需要自行处理跨域.
        1. 设置为类似`/ta404`的值时,`dev`启动将会自动将这个地址代理到`VUE_APP_BACKEND_PATH`所配置的后端接口
        + VUE_APP_ONLINE_THEME
      
        原`faceConfig.onlineTheme`,是否启用在线换肤,设置为其他任何非`true`的值时,都代表`false`
        + VUE_APP_DEFAULT_ONLINE_THEME
      
        原`faceConfig.defaultTheme`,配置在线换肤的默认值,也用于提供编译期的默认颜色变量替换功能,
        + VUE_APP_DARK_MODE
      
        原`faceConfig.defaultDarkMode`,配置是否启用暗黑模式,设置为其他任何非`true`的值时,都代表`false`
        + VUE_APP_DEFAULT_LOCALE

        配置默认的国际化语言,未设置时,默认使用`zh_CN`
    + 开发环境
        + VUE_APP_BACKEND_PATH
   
        配置开发环境的后端接口地址,
    + 开发环境+mock服务
        + MOCK_SERVER
    + 生产环境
        + WAR_NAME
        若需要执行build:war命令生成war包,则此配置为生成的war包的名称
1. `webpackCommonConfig.js` 配置

    + docModule 
    原`faceConfig.docModule`,指示`login`及`index`页面的位置
    
    + coreModules
    原`faceConfig.coreModules`,指示框架核心功能页面的位置
      
    + projectModules
    原`faceConfig.projectModules`,指示项目功能页面的位置
