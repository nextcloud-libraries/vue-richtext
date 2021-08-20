var webpack = require('webpack')

module.exports = {
	base: process.env.VUEPRESS_BASE || '/'
    title: 'vue-richtext',
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Autolink', link: '/link' },
			{ text: 'Markdown', link: '/markdown' },
            { text: 'GitHub', link: 'https://github.com/juliushaertl/vue-richtext' }
        ]
    },
	configureWebpack: {
		plugins: [
			new webpack.DefinePlugin({
				'global': {}, // bizarre lodash(?) webpack workaround
			}),
			new webpack.ProvidePlugin({
				process: 'process/browser',
			}),
		],
		resolve: {
			alias: {
				'@juliushaertl/vue-richtext/dist/vue-richtext.scss': '../../../src/vue-richtext.scss'
			}
		}
	}
}
