const zipFolder = require('folder-zip-sync')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({
  path: path.resolve(__dirname, '../.env.production'),
})
zipFolder('./dist', `./dist/${process.env.WAR_NAME}.war`)
