export default {
  title: '对象模型',
  dataSource: ['source1', 'source2'],
  sourceList: {
    source1: [{
      label: '车辆DW',
      fieldDecoratorId: 'carDw',
      type: 'root',
      fields: [{
        type: 'single-input',
        label: '车辆ID',
        icon: 'icon-input',
        fieldDecoratorId: 'carDwId',
        span: 24,
        display: true
      }, {
        type: 'single-input',
        label: '车辆名称',
        icon: 'icon-input',
        fieldDecoratorId: 'carDwName',
        span: 24,
        display: true
      }]
    }, {
      label: '人员DW',
      fieldDecoratorId: 'personDw',
      type: 'root',
      fields: [{
        type: 'single-input',
        label: '人员ID',
        icon: 'icon-input',
        fieldDecoratorId: 'personDwId',
        span: 24,
        display: true
      }, {
        type: 'single-input',
        label: '人员姓名',
        icon: 'icon-input',
        fieldDecoratorId: 'personDwName',
        span: 24,
        display: true
      }]
    }],
    source2: []
  }
}
