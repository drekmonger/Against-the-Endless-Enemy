import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'

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
  livereload(),
  serve({
		contentBase: './',
		port: 8080,
		open: true
	})
]

let config = {
	input: './src/app.js',
	output: {
		file: './dist/app.js',
		format: 'umd'
	},
	sourcemap: true,
	plugins: plugins
}

export default config