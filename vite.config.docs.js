import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { dependencies } from './package.json'
import mdPlugin from 'vite-plugin-markdown'
const path = require('path')

export default defineConfig({
	base: '/vue-richtext/',
	plugins: [vue(), mdPlugin({ mode: 'html'})],
	build: {
		rollupOptions: {
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
})
