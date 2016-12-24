import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import includePaths from 'rollup-plugin-includepaths'
import localResolve from 'rollup-plugin-local-resolve'
import replace from 'rollup-plugin-replace'

let includePathOptions = {
  include: {},
  paths: ['src'],
  external: [],
  extensions: ['.js']
}

export default {
  entry: 'src/server/index.js',
  format: 'cjs',
  interop: false,
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'development' )
    }),
    includePaths(includePathOptions),
    localResolve(),
    nodeResolve({
      jsnext: true,
      main: true
    })
  ],
  sourceMap: false,
  dest: 'server.bundle.js',
  external: [
    'redux',
    'express',
    'path',
    'http',
    'socket.io',
    'fs'
  ],
}
