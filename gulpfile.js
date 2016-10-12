const gulp = require('gulp')
const fs = require('fs')
const exec = require('child_process').exec
const git = require('gulp-git')
const ora = require('ora')
const log4js = require('log4js')
log4js.loadAppender('file')
log4js.addAppender(log4js.appenders.file('logs/gulp.log'), 'gulp_log');
const log = log4js.getLogger('gulp_log')

const config = require('./config')

gulp.task('default',['copy'], function(){
  log.info('项目编译完成')
})

gulp.task('checkdir', function(cb){
  log.info('开始检查仓库是否存在')
  fs.access(config.gitworkdir, fs.R_OK, (err) => {
    if (err && err.errno === -2) {
      log.info('目录不存在，开始创建目录')
      fs.mkdir(config.gitworkdir, (err) => {
        if (err) throw err
        const gitspinner = ora('clone git 仓库').start()
        git.clone(config.repository, {
          args: config.gitworkdir
        }, (err) => {
          gitspinner.stop()
          if (err) throw err
          cb()          
        })
      })
    } else {
      cb()      
    }
  })
})

gulp.task('installpackage', ['checkdir'], function (cb) {
  log.info('安装项目依赖')
  const npmspinner = ora('安装版本依赖中').start()  
  exec(config.packageManager+' install', {
    cwd: config.gitworkdir
  }, (err, stdout, stderr) => {
    npmspinner.stop()
    if (err) throw err
    cb()
  })
})

gulp.task('updatecode', ['installpackage'], function (cb) {
  log.info('更新项目代码')
  const codeupdate = ora('更新项目代码中').start()   
  git.pull(config.remote, config.branch, {
    cwd: config.gitworkdir
  }, (err) => {
    codeupdate.stop()
    if (err) throw err
    cb()
  })
})

gulp.task('build', ['updatecode'], function (cb) {
  log.info('开始编译项目')  
  const npmspinner = ora('项目编译中').start()  
  exec('npm run build', {
    cwd: config.gitworkdir
  }, (err, stdout, stderr) => {
    npmspinner.stop()
    if (err) throw err
    cb()
  })
})

gulp.task('copy', ['build'], function () {
  log.info('复制编译文件到生产目录')
  return gulp.src(config.gitworkdir+'/dist/**/*')
    .pipe(gulp.dest(config.serverdir))
})
