export default {
  computed: {
    // 根据item的parent添加span或者width
    getConfigNameList () {
      if (this.config.parent === 'dynamic') {
        this.defaultConfigNameList.push('width')
      } else {
        this.defaultConfigNameList.push('span')
      }
      return this.defaultConfigNameList
    }
  }
}
