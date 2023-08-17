const multipleServiceConfig = {
  // 将这里配置的key-value值放到html页面最前面,类似: window.key = value;
  injectScriptToWindow: {
    // 模块名称(比如'corePage/*')必须与docModule/coreModules/projectModules的匹配
    // 1. 使用通配符
    /* 'corePage/!*': {
    // value只能是字符串,可以放多个不同的key-value对
      serverName: 'a',
    }, */
    // 2. 具体的某一个页面
    // 如果需要覆盖通配符中的某一个页面,那么需要单独将这个页面写到docModule/coreModules/projectModules的相应通配符的后面,这样才能覆盖通配的设置
    /* 'corePage/login': {
      serverName: 'b',
      serverName1: 'b',
    }, */
    // 3. 对所有页面生效,特殊配置,将会在所有html文件生效,会被1/2的配置覆盖
    // '*': {
    //   serverName: 'b',
    // },
  },
}

module.exports = { multipleServiceConfig, }
