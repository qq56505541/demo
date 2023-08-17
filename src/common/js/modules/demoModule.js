import Vue from 'vue'

// -----------工具类 start-----------------------------------
// 模块化引入Base的工具，只需要引入需要的内容

// 跨域处理工具:只需要引入
import '@yh/ta-utils/crossDomain'
// 表单提交工具
import formUtil from '@yh/ta404-ui/es/utils/js/form.util'
// 加密工具
import cryptoFn from '@yh/ta404-ui/es/utils/js/cryptoFn'
// 各种弹出框工具
import windowUtil from '@yh/ta404-ui/es/utils/js/window.util'
// 加密工具
import encryption from '@yh/ta404-ui/es/utils/js/encryption/index'
// 导出excel工具
import excelUtil from '@yh/ta404-ui/es/utils/js/excel.util'
// ui 工具类只包含下列函数，
// closeTabMenu(id)
// downloadFile(_ref)
// openTabMenu(item)
// pageMask(_ref)
// reload(page)
// setMaskConfig(opt)
// showMask(opt)
// submit(formObj, submitParameter, callBack)
// asyncGetCodeData(collectionType)
// doCodeFilter(codeList, filter)
// getCodeLabel(codeList, value)
// removeCodeCache(collectionType)

// @yh/ta-utils
import {
  add,
  after,
  arrayEach,
  arrayIndexOf,
  arrayLastIndexOf,
  assign,
  before,
  bind,
  browse,
  camelCase,
  ceil,
  chunk,
  clear,
  clientBrowser,
  clientScreenSize,
  clientSystem,
  clone,
  commafy,
  cookie,
  copyWithin,
  countBy,
  dateDiff,
  dateToMoment,
  dateToString,
  debounce,
  delay,
  destructuring,
  divide,
  each,
  eachTree,
  endsWith,
  entries,
  eqNull,
  escape,
  every,
  filter,
  filterTree,
  find,
  findIndexOf,
  findKey,
  findLast,
  findLastIndexOf,
  findTree,
  first,
  flatten,
  floor,
  format,
  formatWithIndex,
  formatWithReq,
  forOf,
  get,
  getBaseURL,
  getCookie,
  getCurDate,
  getCurDateFullTime,
  getCurDateMonth,
  getCurDateTime,
  getCurDateYear,
  getCurIssue,
  getCurQuarter,
  getDateDiff,
  getDayOfMonth,
  getDayOfYear,
  getHeight,
  getLodop,
  getMoment,
  getMonthWeek,
  getNowPageParam,
  getSize,
  getStyle,
  getToken,
  getType,
  getWhatDay,
  getWhatMonth,
  getWhatWeek,
  getWhatYear,
  getWidth,
  getYearDay,
  getYearWeek,
  groupBy,
  has,
  hasOwnProp,
  includeArrays,
  includes,
  indexOf,
  invoke,
  isArguments,
  isArray,
  isBoolean,
  isChrome,
  isDate,
  isDateSame,
  isDateTime,
  isDocument,
  isElement,
  isEmpty,
  isEqual,
  isEqualWith,
  isError,
  isFinite,
  isFireFox,
  isFloat,
  isFormData,
  isFunction,
  isIE,
  isIE10,
  isIE11,
  isIE9,
  isInteger,
  isLeapYear,
  isMap,
  isMatch,
  isNaN,
  isNull,
  isNumber,
  isObject,
  isPlainObject,
  isRegExp,
  isSafari,
  isSet,
  isString,
  isSymbol,
  isTime,
  isTypeError,
  isUndefined,
  isValidDate,
  isWeakMap,
  isWeakSet,
  isWindow,
  kebabCase,
  keys,
  last,
  lastArrayEach,
  lastEach,
  lastForOf,
  lastIndexOf,
  lastObjectEach,
  locat,
  map,
  mapTree,
  max,
  mean,
  merge,
  min,
  momentArrayToStringArray,
  momentToDate,
  momentToString,
  multiply,
  noop,
  notSupported,
  now,
  objectEach,
  objectMap,
  objectToUrlParam,
  omit,
  once,
  orderBy,
  padEnd,
  padStart,
  parseUrl,
  pick,
  pinyin,
  pluck,
  property,
  random,
  range,
  reduce,
  remove,
  repeat,
  round,
  sample,
  searchTree,
  serialize,
  set,
  setCookie,
  shuffle,
  slice,
  some,
  sortBy,
  sortWithCharacter,
  sortWithLetter,
  sortWithNumber,
  startsWith,
  stringArrayToMomentArray,
  StringToDate,
  stringToMoment,
  subtract,
  sum,
  template,
  throttle,
  timestamp,
  toArray,
  toArrayTree,
  toDateString,
  toFixed,
  toInteger,
  toJSONString,
  toNumber,
  toNumberString,
  toString,
  toStringDate,
  toStringJSON,
  toTreeArray,
  trim,
  trimLeft,
  trimRight,
  unescape,
  union,
  uniq,
  uniqueId,
  unserialize,
  unzip,
  validate2ndIdCard,
  values,
  webStorage,
  zip,
  zipObject,
} from '@yh/ta-utils'
// -----------工具类 end-----------------------------------

// -----------组件 start----------------------------------
// 模块化引入组件
// 通过下面这样引入的组件，可以自动引入组件js以及样式文件（css或less）
// 注意：引入的组件名称区分大小写（比如colorPicker对应：@yh/ta404-ui/es/color-picker）。
import {
  // 常用组件
  affix, // 包括 TaAffix
  alert, // 包括 TaAlert
  anchor, // 包括 TaAnchor、TaAnchorLink
  autoComplete, // 包括 TaAutoComplete、TaAutoCompleteOption、TaAutoCompleteOptGroup
  avatar, // 包括 TaAvatar
  backTop, // 包括 TaBackTop
  badge, // 包括 TaBadge
  borderLayout, // 包括 TaBorderLayout
  breadcrumb, // 包括 TaBreadcrumb、TaBreadcrumbItem
  button, // 包括 TaButton、TaButtonGroup
  calendar, // 包括 TaCalendar
  card, // 包括 TaCard、TaCardMeta、TaCardGrid
  carousel, // 包括 TaCarousel
  cascader, // 包括 TaCascader
  checkbox, // 包括 TaCheckbox、TaCheckboxGroup
  col, // 包括 TaCol
  collapse, // 包括 TaCollapse、TaCollapsePanel
  colorPicker, // 包括 TaColorPicker
  comment, // 包括 TaComment
  configProvider, // 包括 TaConfigProvider
  containerMask, // 包括 TaContainerMask
  datePicker, // 包括 TaDatePicker、TaMonthPicker、TaYearPicker、TaRangePicker、TaWeekPicker、TaQuarterPicker
  divider, // 包括 TaDivider
  drawer, // 包括 TaDrawer
  dropdown, // 包括 TaDropdown、TaDropdownButton
  form, // 包括 TaForm、TaFormItem
  icon, // 包括 TaIcon
  input, // 包括 TaInput、TaInputGroup、TaInputSearch、TaTextarea
  inputNumber, // 包括 TaInputNumber
  labelCon, // 包括 TaLabelCon
  layout, // 包括 TaLayout、TaLayoutHeader、TaLayoutFooter、TaLayoutContent、TaLayoutSider
  list, // 包括 TaList、TaListItem、TaListItemMeta
  // localeProvider, // 包括 TaLocaleProvider
  menu, // 包括 TaMenu、TaMenuItem、TaMenuDivider、TaSubMenu、TaMenuItemGroup
  message,
  modal, // 包括 TaModal
  notification,
  pagination, // 包括 TaPagination
  popconfirm, // 包括 TaPopconfirm
  popoverEx, // 包括 TaPopover
  progress, // 包括 TaProgress
  radio, // 包括 TaRadio、TaRadioGroup、TaRadioButton
  rate, // 包括 TaRate
  row, // 包括 TaRow
  select, // 包括 TaSelect、TaSelectOption、TaSelectOptGroup
  skeleton, // 包括 TaSkeleton
  slider, // 包括 TaSlider
  spin, // 包括 TaSpin
  steps, // 包括 TaSteps】TaStep
  Switch, // 包括 TaSwitch
  table, // 包括 TaTable、TaTableColumn、TaTableColumnGroup
  tableEdit, // 包括 TaTableEdit
  tableOperate, // 包括 TaTableOperate
  tabs, // 包括 TaTabs、TaTabPane、TaTabContent
  tag, // 包括 TaTag、TaCheckableTag、TaTagGroup
  timeline, // 包括 TaTimeline、TaTimelineItem
  timePicker, // 包括 TaTimePicker
  tooltip, // 包括 TaTooltip
  transfer, // 包括 TaTransfer
  treeSelect, // 包括 TaTreeSelect、TaTreeSelectNode
  upload, // 包括 TaUpload、TaUploadDragger
  // 不常用组件
  carefulDelete, // 包括 TaCarefulDelete
  echarts, // 包括 TaEcharts
  richEditor, // 包括 TaRichEditor
  simpleUploader, // 包括 TaSimpleUploader
  bigTable, // 包括 TaBigTable
  searchPanel, // 包括 TaSearchPanel
  sensitiveInput, // 包括 TaSensitiveInput
  userInput, // 包括 TaUserInput
  userSelect, // 包括 TaUserSelect
  tagSelect, // 包括 TaTagSelect
  pageTool, // 包括 TaPageTool
  eTree, // 包括 TaETree
} from '@yh/ta404-ui'

const util = {
  ...formUtil,
  cryptoFn,
  ...windowUtil,
  encryption,
  ...excelUtil,
}

const TaUtils = {
  assign,
  objectEach,
  lastObjectEach,
  objectMap,
  merge,
  uniq,
  union,
  sortBy,
  orderBy,
  shuffle,
  sample,
  some,
  every,
  slice,
  filter,
  find,
  findLast,
  findKey,
  includes,
  arrayIndexOf,
  arrayLastIndexOf,
  map,
  reduce,
  copyWithin,
  chunk,
  zip,
  unzip,
  zipObject,
  flatten,
  toArray,
  includeArrays,
  pluck,
  invoke,
  arrayEach,
  lastArrayEach,
  toArrayTree,
  toTreeArray,
  findTree,
  eachTree,
  mapTree,
  filterTree,
  searchTree,
  hasOwnProp,
  eqNull,
  isNaN,
  isFinite,
  isUndefined,
  isArray,
  isFloat,
  isInteger,
  isFunction,
  isBoolean,
  isString,
  isNumber,
  isRegExp,
  isObject,
  isPlainObject,
  isDate,
  isError,
  isTypeError,
  isEmpty,
  isNull,
  isSymbol,
  isArguments,
  isElement,
  isDocument,
  isWindow,
  isFormData,
  isMap,
  isWeakMap,
  isSet,
  isWeakSet,
  isLeapYear,
  isMatch,
  isEqual,
  isEqualWith,
  getType,
  uniqueId,
  getSize,
  indexOf,
  lastIndexOf,
  findIndexOf,
  findLastIndexOf,
  toStringJSON,
  toJSONString,
  keys,
  values,
  entries,
  pick,
  omit,
  first,
  last,
  each,
  forOf,
  lastForOf,
  lastEach,
  has,
  get,
  set,
  groupBy,
  countBy,
  clone,
  clear,
  remove,
  range,
  destructuring,
  random,
  min,
  max,
  commafy,
  round,
  ceil,
  floor,
  toFixed,
  toNumber,
  toNumberString,
  toInteger,
  add,
  subtract,
  multiply,
  divide,
  sum,
  mean,
  now,
  timestamp,
  isValidDate,
  isDateSame,
  toStringDate,
  toDateString,
  getWhatYear,
  getWhatMonth,
  getWhatWeek,
  getWhatDay,
  getYearDay,
  getYearWeek,
  getMonthWeek,
  getDayOfYear,
  getDayOfMonth,
  getDateDiff,
  trim,
  trimLeft,
  trimRight,
  escape,
  unescape,
  camelCase,
  kebabCase,
  repeat,
  padStart,
  padEnd,
  startsWith,
  endsWith,
  template,
  toString,
  noop,
  property,
  bind,
  once,
  after,
  before,
  throttle,
  debounce,
  delay,
  unserialize,
  getNowPageParam,
  serialize,
  objectToUrlParam,
  parseUrl,
  getBaseURL,
  locat,
  browse,
  cookie,
  stringToMoment,
  stringArrayToMomentArray,
  momentToString,
  momentArrayToStringArray,
  getMoment,
  dateToMoment,
  dateToString,
  momentToDate,
  isTime,
  isDateTime,
  getCurDate,
  getCurDateMonth,
  getCurDateTime,
  getCurDateFullTime,
  getCurQuarter,
  getCurIssue,
  getCurDateYear,
  StringToDate,
  dateDiff,
  webStorage,
  sortWithLetter,
  sortWithNumber,
  sortWithCharacter,
  pinyin,
  getLodop,
  validate2ndIdCard,
  getStyle,
  getWidth,
  getHeight,
  format,
  formatWithReq,
  formatWithIndex,
  setCookie,
  getCookie,
  getToken,
  isIE,
  notSupported,
  isIE9,
  isIE10,
  isIE11,
  isChrome,
  isFireFox,
  isSafari,
  clientSystem,
  clientScreenSize,
  clientBrowser,
}
// 使用Vue注册模块
// 每个页面仅需要注册需要的模块即可

// 注册常用组件
Vue.use(affix)
Vue.use(alert)
Vue.use(anchor)
Vue.use(cascader)
Vue.use(tag)
Vue.use(autoComplete)
Vue.use(avatar)
Vue.use(backTop)
Vue.use(badge)
Vue.use(borderLayout)
Vue.use(breadcrumb)
Vue.use(button)
Vue.use(popoverEx)
Vue.use(labelCon)
Vue.use(calendar)
Vue.use(card)
Vue.use(carousel)
Vue.use(checkbox)
Vue.use(col)
Vue.use(collapse)
Vue.use(colorPicker)
Vue.use(comment)
Vue.use(configProvider)
Vue.use(containerMask)
Vue.use(datePicker)
Vue.use(divider)
Vue.use(drawer)
Vue.use(dropdown)
Vue.use(eTree)
Vue.use(form)
Vue.use(icon)
Vue.use(input)
Vue.use(inputNumber)
Vue.use(layout)
Vue.use(list)
// Vue.use(localeProvider)
Vue.use(menu)
Vue.use(message)
Vue.use(modal)
Vue.use(notification)
Vue.use(pagination)
Vue.use(popconfirm)
Vue.use(progress)
Vue.use(radio)
Vue.use(rate)
Vue.use(row)
Vue.use(select)
Vue.use(skeleton)
Vue.use(slider)
Vue.use(spin)
Vue.use(steps)
Vue.use(Switch)
Vue.use(table)
Vue.use(tableEdit)
Vue.use(tableOperate)
Vue.use(tabs)
Vue.use(timePicker)
Vue.use(timeline)
Vue.use(tooltip)
Vue.use(transfer)
Vue.use(treeSelect)
Vue.use(upload)
// 注册不常用组件
Vue.use(carefulDelete)
Vue.use(echarts)
Vue.use(richEditor)
Vue.use(simpleUploader)
Vue.use(bigTable)
Vue.use(searchPanel)
Vue.use(sensitiveInput)
Vue.use(userInput)
Vue.use(userSelect)
Vue.use(tagSelect)
Vue.use(pageTool)
Vue.use(eTree)

// 注册工具到上Base
Vue.prototype.Base = {
  // 工具类
  ...util,
  // 蒙层
  ...containerMask.$mask,
}
Vue.prototype.$message = message
Vue.prototype.$info = modal.info
Vue.prototype.$success = modal.success
Vue.prototype.$error = modal.error
Vue.prototype.$warning = modal.warning
Vue.prototype.$confirm = modal.confirm
Vue.prototype.$notification = notification
window.message = message
window.notification = notification
window.Modal = modal
window.Spin = spin
window.Base = Vue.prototype.Base

window.TaUtils = {
  ...TaUtils,
}
