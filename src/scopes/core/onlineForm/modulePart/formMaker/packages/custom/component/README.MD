## component文件夹说明
该文件夹存放自定义组件，可以参照外层component文件夹下的的组件编写，最终会加载到formItem.vue内，然后被渲染


## 要求
- 文件名需要以form-item-开头，后边是customFields.js中的type
- 必须抛出change和blur事件，change事件用于更新数据和校验时机，blur用于校验时机
