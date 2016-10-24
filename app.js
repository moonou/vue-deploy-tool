'use strict'
const exec = require('child_process')
  .exec
const fs = require('fs')
const log4js = require('log4js')
const app = require('koa')()
const config = require('./config')
const os = require('os')
const router = require('koa-router')()

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
let updatetype = 0 // 0 is copy, 1 is ftp

router.get('/', function *(next) {
  updatetype = 0
  if (gulpflag) {
    this.body = 'receive request but previous update is not complete ,it will update when that complete'
    againflag = true
  } else {
    this.body = 'receive request will auto deploy project...'
    gulpflag = true
    update ()
  }
})

router.get('/ftp', function *(next) {
  updatetype = 1  
  if (gulpflag) {
    this.body = 'receive request for ftp but previous update is not complete ,it will update when that complete'
    againflag = true
  } else {
    this.body = 'receive request for ftp will auto deploy project...'
    gulpflag = true
    update ()
  }
})

app
  .use(router.routes())
  .use(router.allowedMethods());

function update () {
  let arg = 'copy'
  if ( updatetype === 1 ) { arg = 'ftp' }
  exec('gulp '+arg, (err, stdout, stderr) => {
    // do something
    if (err) throw err
    console.log('部署完成')
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