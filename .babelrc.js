module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					browsers: "extends @nextcloud/browserslist-config"
				},
				include: ['transform-arrow-functions']
			},
		]
	]
}
