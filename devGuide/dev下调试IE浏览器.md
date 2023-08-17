## 在dev模式下启动时，启用IE浏览器兼容

1. `vue.config.js`
    1. `transpileDependencies`配置改为在`development`模式下生效
    1. 测试IE9时，将`css.extract`配置设置为true
1. `webpack.dev.conf.js`
    1. 仅在测试`IE9`时需要使用
    1. 将`// 测试IE9的时候打开`3处注释下方的配置均放开即可
1. IE9下的跨域问题
    1. 使用`dev-server`启动
    或
    1. 使用`nginx`解决跨域问题