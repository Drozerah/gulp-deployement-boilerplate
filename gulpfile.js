require('dotenv').config({ debug: true })
// console.log(process.env)
/**
 * NODE MODULES 
 */
const path = require('path')
/**
 * GULP MODULES 
 */
const { src, dest, series } = require('gulp')
const ftp = require('vinyl-ftp')
const gutil = require( 'gulp-util' )
/**
 * VARIABLES 
 */
const { 
  NODE_ENV,
  HOST,
  LOGIN,
  PASSWORD,
  REMOTE_PATH
 } = process.env
const BASE_DIR = '.'
const OUTPUT_DIR_NAME = 'build'
const OUTPUT_DIR = path.join(BASE_DIR, OUTPUT_DIR_NAME)
// path
const config = {
  html: {
    src: path.join(BASE_DIR, 'index.html')
  }
}
/**
 * GULP TASKS 
 */
// Print NODE_ENV
const ENV = (done) => {
  console.log(`[NODE_ENV] ${NODE_ENV}`)
  done()
}
// Copy index.html
const HTML = (done) => {
  src(config.html.src)
    .pipe(dest(OUTPUT_DIR))
  done()
}
// Deploy
const DEPLOY = (done) => {
  const conn = ftp.create({
    host      : HOST,
    user      : LOGIN,
    password  : PASSWORD,
    parallel  : 5,
    log       : gutil.log
  }),
  glob = [`${OUTPUT_DIR_NAME}/**/*`],
  _src = {
    base      : OUTPUT_DIR,
    buffer    : false,
  },
  remotePath = REMOTE_PATH
  src(glob, _src)
    .pipe(conn.newerOrDifferentSize(remotePath))
    .pipe(conn.dest(remotePath))
  done()
}
/**
 * GULP EXPORTS 
 */
exports.ENV = ENV
exports.HTML = HTML
exports.DEPLOY = DEPLOY
exports.BUILD = series( ENV, HTML )