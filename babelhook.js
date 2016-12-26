// This file is required in mocha.opts
// The only purpose of this file is to ensure
// the babel transpiler is activated prior to any
// test code, and using the same babel options

require('babel-core/register')({
  presets: [
    'react'
  ],
  plugins: [
    'transform-es2015-modules-commonjs', //this is needed because mocha doesn't understand imports
    'transform-class-properties',
    'transform-decorators-legacy',
    ['transform-object-rest-spread', { 'useBuiltIns': true }],
    'transform-function-bind']
})