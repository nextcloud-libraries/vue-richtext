import { resolve } from 'path'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { dependencies } from './package.json'
import mdPlugin from 'vite-plugin-markdown'
const path = require('path')

export default defineConfig({
	plugins: [createVuePlugin(), mdPlugin({ mode: 'html'})],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/package.js'),
			name: '@juliushaertl/vue-richtext',
			fileName: (_format) => 'index.js',
			formats: ['es'],
		},
		rollupOptions: {
			external: Object.keys(dependencies),
			output: {
				globals: { vue: 'Vue' }
			},
		},
		minify: false,
	},
	resolve: {
		alias: {
			'@juliushaertl/vue-richtext': path.resolve(__dirname, './src/RichText.vue')
		},
	},
})
