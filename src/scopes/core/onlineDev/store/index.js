import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default {
  namespaced: true,
  state: {
    currentStep: 0,
    steps: [{
      title: '设计表格',
      content: '',
    }, {
      title: '选择功能',
      content: '',
    }, {
      title: '设计表单',
      content: '',
    }, {
      title: '预览保存',
      content: '',
    }],
    tableName: undefined,
    primaryKey: '',
    tableColumns: [],
    featList: [{
      label: '搜索',
      value: 'search',
      disabled: false,
      title: undefined,
    }, {
      label: '类型过滤',
      value: 'filter',
      disabled: false,
      title: undefined,
    }, {
      label: '新增',
      value: 'add',
      disabled: false,
      title: undefined,
    }, {
      label: '修改',
      value: 'edit',
      disabled: false,
      title: undefined,
    }, {
      label: '删除',
      value: 'delete',
      disabled: false,
      title: undefined,
    },
    // , {
    //   label: '批量删除',
    //   value: 'batchDelete',
    //   disabled: false,
    //   title: undefined,
    // }
    {
      label: '表格Size',
      value: 'size',
      disabled: false,
      title: undefined,
    }, {
      label: '前端分页',
      value: 'pagination',
      disabled: false,
      title: undefined,
    }, {
      label: '显示行号',
      value: 'haveSn',
      disabled: false,
      title: undefined,
    }, {
      label: 'Tooltip',
      value: 'showOverflowTooltip',
      disabled: false,
      title: undefined,
    }
    //   {
    //   label: '固定表头',
    //   value: 'scrollY',
    //   disabled: false,
    //   title: undefined,
    // }, {
    //   label: '固定列',
    //   value: 'scrollX',
    //   disabled: false,
    //   title: undefined,
    // }
    ],
    chosenFeats: [],
    featData: {
      search: null,
      filter: null,
      delete: null,
      size: null,
      haveSn: null,
      showOverflowTooltip: null,
      scrollY: null,
      scrollX: null,
      pagination: null,
    },
    formTemplate: JSON.parse('{"formConfig":{"layout":"horizontal","labelCol":6,"wrapperCol":18,"gutter":0,"previewDrawerWidth":800,"showButton":true},"formColumns":[]}'),
    apis: {
      add: 'add',
      remove: 'remove',
      query: 'query',
      edit: 'edit',
    },
  },
  getters: getters,
  mutations: mutations,
  actions: actions,
}
