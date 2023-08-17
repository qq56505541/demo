## componentConfig文件夹说明
该文件夹存放自定义组件对应的配置项组件，可以参照外层componentConfig文件夹下的的组件编写，最终会加载到formItemConfig.vue内，然后被渲染


##要求
- 文件名需要以-config结尾，前边是配置的type
- 如果该组件可以放入子表单，则在配置中allowInTable需要为true，且需要混入componentConfigMixin以切换span和width配置项，或者自己切换span和width
- 如果该组件不需要放入子表单，则只需能配置span，不能配置width
