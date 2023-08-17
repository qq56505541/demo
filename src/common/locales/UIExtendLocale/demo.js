/**
 * 该demo文件提供定制化UI locale的能力，例如需要额外的语言支持，或者修正/覆盖已有locale，
 * 如需修正/覆盖引入的组件的locale，则在node_modules内找到文件，复制到该文件内进行修正/覆盖
 */
import Pagination from '@yh/ta404-ui/es/pagination/vc-pagination/locale/zh_CN'
import DatePicker from '@yh/ta404-ui/es/date-picker/locale/zh_CN'
import TimePicker from '@yh/ta404-ui/es/time-picker/locale/zh_CN'
import Calendar from '@yh/ta404-ui/es/calendar/locale/zh_CN'
import CarefulDelete from '@yh/ta404-ui/es/careful-delete/locale/zh_CN'
import sensitiveInput from '@yh/ta404-ui/es/sensitive-input/locale/zh_CN'
import userInput from '@yh/ta404-ui/es/user-input/locale/zh_CN'
import userSelect from '@yh/ta404-ui/es/user-select/locale/zh_CN'

export default {
  locale: 'demo',
  Pagination,
  DatePicker,
  TimePicker,
  Calendar,
  CarefulDelete,
  sensitiveInput,
  userInput,
  userSelect,
  // locales for all comoponents
  global: {
    refresh: '刷新',
    print: '打印',
    placeholder: '请选择',
  },
  BorderLayout: {
    expandText: '收起',
    FoldText: '展开',
  },
  Table: {
    filterTitle: '筛选',
    filterConfirm: '确定',
    filterReset: '重置',
    selectAll: '全选当页',
    selectInvert: '反选当页',
    sortTitle: '排序',
    expand: '展开行',
    collapse: '关闭行',
  },
  Modal: {
    maximize: '最大化',
    minimize: '最小化',
    okText: '确定',
    cancelText: '取消',
    justOkText: '知道了',
  },
  Popconfirm: {
    cancelText: '取消',
    okText: '确定',
  },
  Transfer: {
    searchPlaceholder: '请输入搜索内容',
    itemUnit: '项',
    itemsUnit: '项',
  },
  Upload: {
    uploading: '文件上传中',
    removeFile: '删除文件',
    uploadError: '上传错误',
    previewFile: '预览文件',
    downloadFile: '下载文件',
  },
  Empty: {
    description: '暂无数据',
  },
  Icon: {
    icon: '图标',
  },
  Text: {
    edit: '编辑',
    copy: '复制',
    copied: '复制成功',
    expand: '展开',
  },
  PageHeader: {
    back: '返回',
  },
  PageTool: {
    itemName: '功能',
  },
  simpleUploader: {
    selectFiles: '选择文件',
  },
}
