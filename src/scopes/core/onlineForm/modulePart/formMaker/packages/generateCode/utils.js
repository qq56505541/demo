export const beautifierConf = {
  html: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'separate',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: true,
    wrap_attributes: 'force-expand-multiline',
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true,
  },
  js: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'normal',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: true,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true,
  },
}

export function transformRules (column) {
  let rulesArr = []
  try {
    rulesArr = JSON.parse(column.rules.replace(/&#x27;/g, '\'').replace(/'/g, '"'))
    console.log(`${column.fieldDecoratorId}的校验规则解析成功，为${JSON.stringify(rulesArr)}`)
  } catch (e) {
    console.warn(`解析${column.fieldDecoratorId}的校验rules失败`)
    rulesArr = []
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return rulesArr || []
  }
}

export const createAndDownloadFile = (fileName, content) => {
  const aTag = document.createElement('a')
  const blob = new Blob([content])
  aTag.download = fileName
  aTag.href = URL.createObjectURL(blob)
  aTag.click()
  URL.revokeObjectURL(blob)
}
