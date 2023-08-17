const PREFIX = 'onlineForm/templateMg/templateMgRestService/'

const queryTemplate = function (data) {
  return Base.submit(null, {url: PREFIX + 'queryTemplate', data: data})
}

const insertTemplate = function (data) {
  return Base.submit(null, {url: PREFIX + 'insertTemplate', data: data})
}

const updateTemplate = function (data) {
  return Base.submit(null, {url: PREFIX + 'updateTemplate', data: data})
}

const updateTemplateEffective = function (data) {
  return Base.submit(null, {url: PREFIX + 'updateTemplateEffective', data: data})

}

const deleteTemplates = function (data) {
  return Base.submit(null, {url: PREFIX + 'deleteTemplates', data: data})
}

export default {
  queryTemplate,
  insertTemplate,
  updateTemplate,
  updateTemplateEffective,
  deleteTemplates
}
