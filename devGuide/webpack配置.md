
# webpack配置

简单配置可通过 webpackCommonConfig.js 文件进行配置
## webpackCommonConfig.js 文件

这个js文件,存放了以下几个参数:

### splitChunks

用于配置拆分js模块

- 类型: {}

拆分js模块,可以降低一个js文件中包含的模块数量,减少js文件的下载及解析时间.

**注意**

1. 拆分js模块,需要根据项目具体情况进行配置.配置步骤见[cacheGroups配置文档](./cacheGroups配置.md)
1. js模块不是拆分的越小越好,js拆分越多,则一个页面可能需要加载的js文件就会越多,此时,加载多个小的js文件所需的时间可能会远远超过加载一个大的js文件所需的时间

### supportIE: 是否需要支持IE

配置需要提供`{dev: true/false, build: true/false}`的值

`dev`设置为`true`时,支持以下功能
1. `dev`启动时,自动转换配置的`needToBabel`
1. `dev`启动时,提取样式文件到单独的文件中
1. `dev`启动时,将提取的样式文件进行切割(由于IE9限制了css文件的长度,所以必须有这个步骤)
   
`build`设置为`true`时,支持以下功能
1. `build`时,自动转换配置的`needToBabel`
1. `build`时,将提取的样式文件进行切割(由于IE9限制了css文件的长度,所以必须有这个步骤)

### alias:

`webpack`的`alias`配置

### needToBabel

- 类型: [string/regex]

由于IE不支持ES6语法,所以在编译`node_modules`模块时,需要将不兼容
的模块加入到这个数组中,以进行`babel`转换

**注意**

1. 如果需要将`node_modules`下的所有模块都进行`babel`转义,`name`需要为`[/.*/]`
1. 不要将太多的模块写到这里,否则会造成webpack的编译时间延长

### jsOutputFile

输出的js文件目录及名称

**注意**

必须包含[name]和[fullhash:8],否则会导致生成的文件被覆盖

### cssOutputFile

输出的css文件目录及名称

**注意**

必须包含[name]和[fullhash:8],否则会导致生成的文件被覆盖
