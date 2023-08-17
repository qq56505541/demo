#!/usr/bin/env node
//   [
//   '/usr/local/Cellar/node/16.6.1/bin/node',
//     '/Users/windson/Projects/WebStorm/yh/taFaceNex/node_modules/.bin/vue-cli-service',

// [
//   '/usr/local/Cellar/node/16.6.1/bin/node',
//   '/Users/windson/Projects/WebStorm/yh/taFaceNex/build/build.js'
// ]
const path = require('path')
const { error, } = require('@vue/cli-shared-utils')
const Service = require('@vue/cli-service/lib/Service')
const webpackCommonConfig = require('../webpackCommonConfig').webpackCommonConfig
const service = new Service(process.env.VUE_CLI_CONTEXT || process.cwd())
process.argv = [
  process.argv[0],
  path.resolve(__dirname, '../node_modules/.bin/vue-cli-service'),
  'build',
  '--target',
  'lib',
  '--filename',
  webpackCommonConfig.lib.filename,
  '--formats',
  'umd',
  'src/components/index.js'
]
const rawArgv = process.argv.slice(2)
const args = require('minimist')(rawArgv, {
  boolean: [
    // build
    // FIXME: --no-module, --no-unsafe-inline, no-clean, etc.
    'modern',
    'report',
    'report-json',
    'inline-vue',
    'watch',
    // serve
    'open',
    'copy',
    'https',
    // inspect
    'verbose'
  ],
})
const command = args._[0]

service.run(command, args, rawArgv).catch(err => {
  error(err)
  process.exit(1)
})
