import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { dependencies } from './package.json'
import mdPlugin from 'vite-plugin-markdown'
const path = require('path')

export default defineConfig({
	plugins: [vue(), mdPlugin({ mode: 'html'})],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/package.js'),
			name: '@nextcloud/vue-richtext',
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
			'@nextcloud/vue-richtext': path.resolve(__dirname, './src/RichText.vue')
		},
	},
	test: {
		/* for example, use global to avoid globals imports (describe, test, expect): */
		// globals: true,
		environment : "jsdom",
	},
})
