import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es';

const plugins = [
	babel({
		babelrc: false,
		presets: [],
		plugins: [
			['transform-react-jsx', { pragma: 'h' }]
		]
	}),
	resolve({
		jsnext: true
  }),
  uglify({ecma: 8}, minify)
]

let config = {
	input: './src/app.js',
	output: {
		file: './dist/app.js',
		format: 'iife'
	},
	sourcemap: false,
	plugins: plugins
}

export default config