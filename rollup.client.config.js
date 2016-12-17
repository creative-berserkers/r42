import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import includePaths from 'rollup-plugin-includepaths'
import localResolve from 'rollup-plugin-local-resolve'
import replace from 'rollup-plugin-replace'
import modular from 'modular-css/rollup'

let includePathOptions = {
    include: {},
    paths: ['src', 'lib'],
    external: [],
    extensions: ['.js']
};

export default {
  entry: 'src/index.js',
  plugins: [
    modular({
      css : "public/bundle.css"
    }),
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
    }),

    /*commonjs({
      include: 'node_modules/**',
      sourceMap: false
    })*/
  ],
  sourceMap: false,
  dest: 'public/bundle.js'
};
