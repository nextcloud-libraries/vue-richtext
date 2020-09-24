import vue from 'rollup-plugin-vue'
import babel from 'rollup-plugin-babel'
import scss from 'rollup-plugin-scss'
import commonjs from 'rollup-plugin-commonjs'
import css from 'rollup-plugin-css-only'
import copy from 'rollup-plugin-copy'
import del from 'rollup-plugin-delete'
import { eslint } from 'rollup-plugin-eslint'
import terser from 'rollup-plugin-terser'

const isProduction = process.env.NODE_ENV === 'production'

export default {
	input: 'src/RichText.vue',
	output: {
		format: 'esm',
		file: 'dist/vue-richtext.js'
	},
	external: [
		'unified',
		'remark-parse',
		'remark-disable-tokenizers',
		'remark-external-links',
		'remark-external-links',
		'remark-rehype',
		'rehype-add-classes',
		'rehype-react',
		'rehype-sanitize'
	],
	plugins: [
		del({
			targets: 'dist/*'
		}),
		eslint({
			include: ['src/**/*.vue']
		}),
		commonjs(),
		vue({
			css: false
		}),
		babel({
			exclude: 'node_modules/**',
			sourceType: 'unambiguous'
		}),
		scss({
			output: 'dist/vue-richtext.min.css',
			outputStyle: 'compressed'
		}),
		css(),
		copy({
			targets: [
				{
					src: 'src/vue-richtext.scss',
					dest: 'dist/'
				}
			]
		}),
		isProduction && terser.terser()
	]
}
