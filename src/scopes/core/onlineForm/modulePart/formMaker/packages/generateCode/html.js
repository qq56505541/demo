import { beautifierConf, transformRules, } from './utils'
import jsBeautify from 'js-beautify'

const getDefaultProps = item => {
  const disabled = item.disabled === true ? ' :disabled="true"' : ''
  const placeholder = item.placeholder ? ` placeholder="${item.placeholder}"` : ` placeholder="请输入${item.label}"`
  return {
    disabled,
    placeholder,
  }
}

const getDataProps = (item, propsName = 'options') => {
  const options = item.dataType !== 'dict' ? ` :${propsName}="dataSource_${item.fieldDecoratorId}"` : ''
  const collectionType = item.dataType === 'dict' ? ` collection-type="${item.collectionType}"` : ''
  const collectionFilter = item.dataType === 'dict' && item.collectionFilter && item.collectionFilter.length > 0 ? ` collection-filter="${item.collectionFilter}"` : ''
  const reverseFilter = item.dataType === 'dict' && item.reverseFilter === true ? ` :collection="${item.reverseFilter}"` : ''
  return {
    options,
    collectionType,
    collectionFilter,
    reverseFilter,
  }
}

const components = {
  'single-input': item => {
    const {
      disabled,
      placeholder,
    } = getDefaultProps(item)
    const addonBefore = item.addonBefore ? ` addon-before="${item.addonBefore}"` : ''
    const addonAfter = item.addonAfter ? ` addon-after="${item.addonAfter}"` : ''
    return `<ta-input${disabled}${placeholder}${addonBefore}${addonAfter}/>`
  },
  password: item => {
    const {
      disabled,
      placeholder,
    } = getDefaultProps(item)
    const type = ' type="password"'
    return `<ta-input${type}${disabled}${placeholder}/>`
  },
  'multi-input': item => {
    const {
      disabled,
      placeholder,
    } = getDefaultProps(item)
    const rows = item.rows ? ` :rows="${item.rows}"` : ''
    return `<ta-input-textarea${disabled}${placeholder}${rows}/>`
  },
  number: item => {
    const {
      disabled,
      placeholder,
    } = getDefaultProps(item)
    const min = item.min ? ` :min="${item.min}"` : ''
    const max = item.max ? ` :max="${item.max}"` : ''
    const precision = item.precision ? ` :precision="${item.precision}"` : ''
    const step = item.step ? ` :step="${item.step}"` : ''
    const decimalSeparator = item.decimalSeparator ? ` :decimal-separator="${item.decimalSeparator}"` : ''
    const asAmount = item.asAmount === true ? ' as-amount' : ''
    const amountPre = item.asAmount && item.amountPre ? ` :amount-pre="${item.amountPre}"` : ''
    const alignRight = item.alignRight === true ? ' align-right' : ''
    return `<ta-input-number${disabled}${placeholder}${min}${max}${precision}${step}${decimalSeparator}${asAmount}${amountPre}${alignRight}/>`
  },
  switch: item => {
    const {
      disabled,
    } = getDefaultProps(item)
    return `<ta-switch${disabled}/>`
  },
  radio: item => {
    const {
      disabled,
    } = getDefaultProps(item)
    const {
      options,
      collectionType,
      collectionFilter,
      reverseFilter,
    } = getDataProps(item)
    return `<ta-radio-group${disabled}${options}${collectionType}${collectionFilter}${reverseFilter}/>`
  },
  checkbox: item => {
    const {
      disabled,
    } = getDefaultProps(item)
    const {
      options,
      collectionType,
      collectionFilter,
      reverseFilter,
    } = getDataProps(item)
    return `<ta-checkbox-group${disabled}${options}${collectionType}${collectionFilter}${reverseFilter}/>`
  },
  select: item => {
    const {
      disabled,
      placeholder,
    } = getDefaultProps(item)
    const {
      options,
      collectionType,
      collectionFilter,
      reverseFilter,
    } = getDataProps(item)
    const allowClear = item.allowClear === true ? ' allow-clear' : ''
    const mode = item.mode !== 'default' ? ` mode="${item.mode}"` : ''
    return `<ta-select${disabled}${allowClear}${mode}${placeholder}${options}${collectionType}${collectionFilter}${reverseFilter}/>`
  },
  cascader: item => {
    const {
      disabled,
      placeholder,
    } = getDefaultProps(item)
    const {
      options,
    } = getDataProps(item)
    const expandTrigger = item.expandTrigger ? ` expand-trigger="${item.expandTrigger}"` : ''
    const allowClear = item.allowClear === true ? ' allow-clear' : ''
    const changeOnSelect = item.changeOnSelect === true ? ' change-on-select' : ''
    return `<ta-cascader${disabled}${allowClear}${placeholder}${options}${expandTrigger}${changeOnSelect}/>`
  },
  tree: item => {
    const {
      disabled,
      placeholder,
    } = getDefaultProps(item)
    const {
      options: treeData,
    } = getDataProps(item, 'tree-data')
    const allowClear = item.allowClear === true ? ' allow-clear' : ''
    return `<ta-tree-select${disabled}${allowClear}${placeholder}${treeData}/>`
  },
  year: item => {
    const {
      disabled,
      placeholder,
    } = getDefaultProps(item)
    const allowClear = item.allowClear === true ? ' allow-clear' : ''
    const format = item.format ? ` format="${item.format}"` : ''
    const validNowTime = item.validNowTime !== '-1' ? ` valid-now-time="${item.validNowTime}"` : ''
    return `<ta-year-picker${disabled}${allowClear}${placeholder}${format}${validNowTime}/>`
  },
  quarter: item => {
    const {
      disabled,
      placeholder,
    } = getDefaultProps(item)
    const allowClear = item.allowClear === true ? ' allow-clear' : ''
    const format = item.format ? ` format="${item.format}"` : ''
    const validNowTime = item.validNowTime !== '-1' ? ` valid-now-time="${item.validNowTime}"` : ''
    return `<ta-quarter-picker${disabled}${allowClear}${placeholder}${format}${validNowTime}/>`
  },
  month: item => {
    const {
      disabled,
      placeholder,
    } = getDefaultProps(item)
    const allowClear = item.allowClear === true ? ' allow-clear' : ''
    const format = item.format ? ` format="${item.format}"` : ''
    const validNowTime = item.validNowTime !== '-1' ? ` valid-now-time="${item.validNowTime}"` : ''
    return `<ta-month-picker${disabled}${allowClear}${placeholder}${format}${validNowTime}/>`
  },
  week: item => {
    const {
      disabled,
      placeholder,
    } = getDefaultProps(item)
    const allowClear = item.allowClear === true ? ' allow-clear' : ''
    const format = item.format ? ` format="${item.format}"` : ''
    const validNowTime = item.validNowTime !== '-1' ? ` valid-now-time="${item.validNowTime}"` : ''
    return `<ta-week-picker${disabled}${allowClear}${placeholder}${format}${validNowTime}/>`
  },
  date: item => {
    const {
      disabled,
      placeholder,
    } = getDefaultProps(item)
    const allowClear = item.allowClear === true ? ' allow-clear' : ''
    const format = item.format ? ` format="${item.format}"` : ''
    const validNowTime = item.validNowTime !== '-1' ? ` valid-now-time="${item.validNowTime}"` : ''
    const showToday = item.showToday === true ? ' show-today' : ''
    return `<ta-date-picker${disabled}${allowClear}${placeholder}${format}${validNowTime}${showToday}/>`
  },
  time: item => {
    const {
      disabled,
      placeholder,
    } = getDefaultProps(item)
    const allowClear = item.allowClear === true ? ' allow-clear' : ''
    const format = item.format ? ` format="${item.format}"` : ''
    return `<ta-time-picker${disabled}${allowClear}${placeholder}${format}/>`
  },
  datetime: item => {
    const {
      disabled,
      placeholder,
    } = getDefaultProps(item)
    const allowClear = item.allowClear === true ? ' allow-clear' : ''
    const showTime = ' show-time'
    const format = item.format ? ` format="${item.format}"` : ''
    const validNowTime = item.validNowTime !== '-1' ? ` valid-now-time="${item.validNowTime}"` : ''
    const showToday = item.showToday === true ? ' show-today' : ''
    return `<ta-date-picker${disabled}${allowClear}${placeholder}${showTime}${format}${validNowTime}${showToday}/>`
  },
  daterange: item => {
    const {
      disabled,
      placeholder,
    } = getDefaultProps(item)
    const allowClear = item.allowClear === true ? ' allow-clear' : ''
    const format = item.format ? ` format="${item.format}"` : ''
    const validNowTime = item.validNowTime !== '-1' ? ` valid-now-time="${item.validNowTime}"` : ''
    const allowOne = item.allowOne === true ? ' allow-one' : ''
    return `<ta-date-range-picker${disabled}${allowClear}${placeholder}${allowOne}${format}${validNowTime}/>`
  },
  datetimerange: item => {
    const {
      disabled,
      placeholder,
    } = getDefaultProps(item)
    const allowClear = item.allowClear === true ? ' allow-clear' : ''
    const showTime = ' show-time'
    const format = item.format ? ` format="${item.format}"` : ''
    const validNowTime = item.validNowTime !== '-1' ? ` valid-now-time="${item.validNowTime}"` : ''
    const allowOne = item.allowOne === true ? ' allow-one' : ''
    return `<ta-date-range-picker${disabled}${allowClear}${placeholder}${showTime}${allowOne}${format}${validNowTime}/>`
  },
}

const buildDivider = () => {
  return '<br>'
}

const buildSlot = (item) => {
  return `<div class="ant-col-24">
    <slot name="${item.slotName}"/>
  </div>`
}

const buildNormalFormItem = (item, dynamic = false) => {
  const component = components[item.type](item)
  const label = item.label && !dynamic ? ` label="${item.label}"` : ''
  const id = dynamic ? ` :field-decorator-id="${JSON.stringify(item.fieldDecoratorId + '_').replace(/'/g, '\\\'').replace(/"/g, '\'')} + recordIndex"` : ` field-decorator-id="${item.fieldDecoratorId}"`
  const span = item.span ? ` :span="${item.span}"` : ''
  const extra = item.extra ? ` :extra="${item.extra}"` : ''
  const required = item.required ? ` :required="${item.required}"` : ''
  const cls = item.type === 'multi-input' ? ' class="multi-input-form-item"' : ''
  const wrapperCol = dynamic ? ' :wrapper-col="{span: 24}"' : ''

  const valuePropName = item.type === 'switch' ? 'valuePropName: \'checked\', ' : ''
  const initialValue = item.type !== 'switch' ? (item.initialValue ? `initialValue: ${JSON.stringify(item.initialValue).replace(/'/g, '\\\'').replace(/"/g, '\'')}, ` : '') : (item.initialValue === 'true' ? 'initialValue: true' : '')
  const validateTrigger = item.validateTrigger && item.validateTrigger.length > 0 ? `validateTrigger: ${JSON.stringify(item.validateTrigger).replace(/"/g, '\'')}, ` : ''
  let rules = []
  if (item.rules && item.rules !== '') {
    rules = transformRules(item) || []
    if (item.required) {
      rules.push({
        required: item.required || false,
        message: item.message,
      })
    }
  }
  rules = rules.length ? `rules: ${JSON.stringify(rules).replace(/'/g, '\\\'').replace(/"/g, '\'')}` : ''
  let fieldDecoratorOptions = ''
  if (valuePropName || initialValue || validateTrigger || rules) {
    fieldDecoratorOptions = ` :field-decorator-options="{${valuePropName}${initialValue}${validateTrigger}${rules}`
    fieldDecoratorOptions = fieldDecoratorOptions.endsWith(', ') ? fieldDecoratorOptions.slice(0, fieldDecoratorOptions.length - 2) + '}"' : fieldDecoratorOptions + '}"'
  }

  return `<ta-form-item${cls}${span}${label}${id}${wrapperCol}${extra}${required}${fieldDecoratorOptions}>
    ${component}
  </ta-form-item>`
}

const buildDynamic = (item, formData) => {
  const labelConWrapper = (children) => {
    const style = ' style="width: 100%;position: static;"'
    const label = ` label="${item.label}"`
    const labelCol = ` :label-col="{span: ${formData.formConfig.labelCol}}"`
    const wrapperCol = ` :wrapper-col="{span: ${formData.formConfig.wrapperCol}}"`
    return `<ta-label-con${style}${label}${labelCol}${wrapperCol}>
      ${children}
    </ta-label-con>`
  }

  const buildTable = (children) => {
    return `<ta-table :data-source="dataSource_${item.fieldDecoratorId}">
      ${children}
    </ta-table>`
  }

  const buildColumns = () => {
    const controllItemColumn = `<ta-table-column data-index="dynamicControl" width="20px">
      <ta-button
        slot="title"
        @click="dynamicAddItem('dataSource_${item.fieldDecoratorId}')"
        shape="circle"
        type="primary"
        icon="plus"
      />
      <template slot-scope="text, record, recordIndex">
        <ta-button
          slot="title"
          @click="dynamicDeleteItem('dataSource_${item.fieldDecoratorId}', recordIndex)"
          shape="circle"
          type="danger"
          icon="minus"
        />
      </template>
    </ta-table-column>`

    const buildColumns = (item) => {
      const itemRequired = item.required ? ' class="column-required"' : ''
      const width = item.width ? ` :width="${item.width}"` : ' width="100px"'
      const dataIndex = ` data-index="${item.fieldDecoratorId}"`
      return `<ta-table-column${width}${dataIndex}>
        <span slot="title">
          <span${itemRequired}>${item.label}</span>
        </span>
        <template slot-scope="text, record, recordIndex">
          ${buildNormalFormItem(item, true)}
        </template>
      </ta-table-column>`
    }

    const otherColumns = item.children.column
      .map(item => item.display && buildColumns(item))
      .filter(item => item)
      .reduce((prev, curr) => {
        return prev + curr
      }, '')

    return controllItemColumn + otherColumns
  }

  return item.label !== '' ? labelConWrapper(buildTable(buildColumns())) : buildTable(buildColumns())
}

const buildFormItem = (item, formData) => {
  if (item.type === 'slot') return buildSlot(item)
  if (item.type === 'divider') return buildDivider()
  if (item.type === 'dynamic') return buildDynamic(item, formData)
  return buildNormalFormItem(item)
}

const buildFormChildren = (formData) => {
  return formData.formColumns
    .map(item => item.display && buildFormItem(item, formData))
    .filter(item => item)
    .reduce((previousValue, currentValue) => {
      return previousValue + currentValue
    }, '')
}

const buildFormTemplate = (formData, children) => {
  return `<ta-form
    :auto-form-create="(form)=>{this.form = form}"
    layout="${formData.formConfig.layout}"
    :form-layout="true"
    :label-col="{span: ${formData.formConfig.labelCol}}"
    :wrapper-col="{span: ${formData.formConfig.wrapperCol}}"
    :gutter="${formData.formConfig.gutter}"
  >
    ${children}
  </ta-form>`
}

export const vueTemplate = (formData) => {
  const str = buildFormTemplate(formData, buildFormChildren(formData))
  return jsBeautify.html(`<template>
    <div class="fit">
      ${str}
    </div>
  </template>`, beautifierConf.html)
}
