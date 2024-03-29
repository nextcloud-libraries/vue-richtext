module.exports = {
	root: true,
	globals: {
		t: true,
		n: true,
		OC: true,
		OCA: true,
		Vue: true,
		VueRouter: true,
		SCOPE_VERSION: true
	},
	parserOptions: {
		parser: '@babel/eslint-parser',
		ecmaVersion: 8
	},
	extends: [
		'eslint:recommended',
		'plugin:node/recommended',
		'plugin:vue/essential',
		'plugin:vue/recommended',
		'standard'
	],
	plugins: [
		'nextcloud',
		'node',
		'vue',
	],
	rules: {
		// space before function ()
		'space-before-function-paren': ['error', 'never'],
		// curly braces always space
		'object-curly-spacing': ['error', 'always'],
		// stay consistent with array brackets
		'array-bracket-newline': ['error', 'consistent'],
		// 1tbs brace style
		'brace-style': 'error',
		// tabs only
		indent: ['error', 'tab'],
		'no-tabs': 0,
		'vue/html-indent': ['error', 'tab'],
		// only debug console
		'no-console': ['error', { allow: ['error', 'warn', 'debug'] }],
		// classes blocks
		'padded-blocks': ['error', { classes: 'always' }],
		// always have the operator in front
		'operator-linebreak': ['error', 'before'],
		// ternary on multiline
		'multiline-ternary': ['error', 'always-multiline'],
		// Nextcloud deprecations
		'nextcloud/no-deprecations': 'warn',
		// don't allow removed APIs
		'nextcloud/no-removed-apis': 'error',
		// es6 import/export and require
		'node/no-missing-import': ['error', {
	            'tryExtensions': ['.js', '.json', '.vue']
		}],
		'node/no-unpublished-require': ['off'],
		'node/no-unsupported-features/es-syntax': ['off'],
		// kebab case components for vuejs
		'vue/component-name-in-template-casing': ['error', 'PascalCase'],
		// force name
		'vue/match-component-file-name': ['error', {
			'extensions': ['jsx', 'vue', 'js'],
			'shouldMatchCase': true
		 }],
		// space before self-closing elements
		'vue/html-closing-bracket-spacing': 'error',
		// no ending html tag on a new line
		'vue/html-closing-bracket-newline': ['error', { multiline: 'never' }],
		// code spacing with attributes
		'vue/max-attributes-per-line': [
			'error',
			{
				singleline: 3,
				multiline: 3
			}
		]
	}
}
