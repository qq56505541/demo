import { vueTemplate, } from './html'
import { vueScript, } from './js'
import { vueStyle, } from './css'
import { createAndDownloadFile, } from './utils'

export const generateSourceCode = formData => {
  return vueTemplate(formData) + vueScript(formData) + vueStyle(formData)
}

export const generateSourceFile = formData => {
  createAndDownloadFile('SourceCode.vue', generateSourceCode(formData))
}

export * from './html'
export * from './js'
export * from './css'
