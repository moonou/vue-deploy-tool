# Vue Deploy Tool

A deploy tool for `vue.js` , when git send you `webhook` or setting auto fetch by long time loop, it will build and copy to dist src. 

# Usage

Make sure your NodeJs is 4.x

## install gulp to global

``` shell
npm install gulp -g
```

## Install
clone this project and cd this folder

## Configure
configure project related information in config.js

``` javascript
module.exports = {
  repository: '', // git repository url
  gitworkdir: '.temp', // git folder
  remote: 'origin', 
  branch: 'master',
  packageManager: 'cnpm', // umm...., change your npm package manager
  serverdir: '', //produce folder
  serverport: 3000 // server listen port
}
```
## Start
``` shell
node app.js
```