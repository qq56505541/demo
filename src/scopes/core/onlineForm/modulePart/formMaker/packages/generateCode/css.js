import jsBeautify from 'js-beautify'

const buildStyle = (formData) => {
  const clsList = []
  formData.formColumns.map(item => {
    if (item.type === 'multi-input' && !clsList.includes('multi-input-form-item')) {
      clsList.push('multi-input-form-item')
    }
    if (item.type === 'dynamic' && !clsList.includes('column-required')) {
      clsList.push('column-required')
    }
  })
  return clsList.reduce((prev, curr) => {
    if (curr === 'multi-input-form-item') {
      return prev += `
.multi-input-form-item /deep/ .ant-form-item-children {
  height: auto !important;
}`
    }
    if (curr === 'column-required') {
      return prev += `
.column-required {
  &:before{
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}`
    }
  }, '')
}

export const vueStyle = (formData) => {
  const cssStr = jsBeautify.css(buildStyle(formData))
  return `
<style lang="less" type="text/less">
  ${cssStr}
</style>`
}
