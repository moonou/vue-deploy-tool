'use strict'
const exec = require('child_process')
  .exec
const fs = require('fs')
const log4js = require('log4js')

log4js.loadAppender('file')

// check logs dir and log files
function checkfile(files) {
  for (let file of files) {
    fs.access(file, fs.F_OK, (err) => {
      if (err && err.errno === -2) {
        fs.writeFile(file, '', (err) => {
          console.log('创建文件', file)
          if (err) {
            throw (err)
          }
        })
      }
    })
  }
}
checkfile(['./logs/gulp.log'])