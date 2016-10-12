'use strict'
const exec = require('child_process')
  .exec
const fs = require('fs')
const log4js = require('log4js')
const app = require('koa')()
const config = require('./config')
const os = require('os')

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

let gulpflag = false
let againflag = false 
app.use(function *(){
  if (gulpflag) {
    this.body = 'receive request but previous update is not complete ,it will update when that complete'
    againflag = true
  } else {
    this.body = 'receive request will auto deploy project...'
    gulpflag = true
    update ()
  }
})

function update () {
  exec('gulp', (err, stdout, stderr) => {
    // do something
    if (err) throw err
    console.log('打包完成')
    gulpflag = false
    if (againflag) {
      againflag = false
      update()
    }
  }).stdout.on('data', (data) => {
    console.log(data)
  })
}

app.listen(config.serverport, () => {
  console.log('server is stared\n')
  console.log('=================\n')
})