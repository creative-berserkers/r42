import jsx from 'rollup-plugin-jsx'
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import includePaths from 'rollup-plugin-includepaths';
import localResolve from 'rollup-plugin-local-resolve';
import replace from 'rollup-plugin-replace';

let includePathOptions = {
    include: {},
    paths: ['src'],
    external: [],
    extensions: ['.js']
};

export default {
  entry: 'src/index.js',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'development' )
    }),
    includePaths(includePathOptions),
    localResolve(),
    jsx( {factory: 'React.createElement'} ),
    nodeResolve({
      jsnext: true,
      main: true
    }),

    /*commonjs({
      include: 'node_modules/**',
      sourceMap: false
    })*/
  ],
  sourceMap: true,
  dest: 'public/bundle.js'
};
