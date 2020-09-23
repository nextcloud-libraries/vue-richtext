<!--
  - @copyright Copyright (c) 2020 Julius Härtl <jus@bitgrid.net>
  - @copyright Copyright (c) 2020 Guido Krömer <mail@cacodaemon.de>
  -
  - @author Julius Härtl <jus@bitgrid.net>
  -
  - @license GNU AGPL version 3 or any later version
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<script>
import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import rehype2react from 'rehype-react'
import remarkDisableBlocks from 'remark-disable-tokenizers'
import remarkExternalLinks from 'remark-external-links'
import rehypeAddClasses from 'rehype-add-classes'

/*
* Code inspired by https://github.com/cool-cousin/vue-remark
* */
function pluginComponent() {
	const { inlineTokenizers, inlineMethods } = this.Parser.prototype
	inlineTokenizers.component = (eat, value, silent) => {
		const match = /^\{([-\w]+)\}/.exec(value)

		if (!match) {
			return
		}

		if (silent) {
			return true
		}

		const [all, component] = match

		return eat(all)({
			type: 'component',
			component: `#${component}`,
			value: ''
		})
	}
	inlineTokenizers.component.locator = (value, fromIndex) => {
		return value.indexOf('{', fromIndex)
	}
	inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'component')
}

export default {
	name: 'RichText',
	props: {
		text: {
			type: String,
			default: ''
		},
		arguments: {
			type: Object,
			default: () => {
				return {}
			}
		},
		markdownCssClasses: {
			type: Object,
			default: () => {
				return {
					a: 'rich-text--external-link',
					li: 'rich-text--list-element',
					strong: 'rich-text--strong',
					em: 'rich-text--italic',
					h1: 'rich-text--heading rich-text--heading-1',
					h2: 'rich-text--heading rich-text--heading-2',
					h3: 'rich-text--heading rich-text--heading-3',
					h4: 'rich-text--heading rich-text--heading-4',
					h5: 'rich-text--heading rich-text--heading-5',
					h6: 'rich-text--heading rich-text--heading-6',
					hr: 'rich-text--hr',
					table: 'rich-text--table',
					pre: 'rich-text--pre',
					code: 'rich-text--code',
					blockquote: 'rich-text--blockquote'
				}
			}
		},
		disableMarkdownInlineFeatures: {
			type: Array,
			default: () => {
				return []
			}
		},
		disableMarkdownBlockFeatures: {
			type: Array,
			default: () => {
				return []
			}
		},
		autolink: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		remarkDisableOptions() {
			return {
				inline: [...(this.autolink ? [] : ['url']), ...this.disableMarkdownInlineFeatures],
				block: this.disableMarkdownBlockFeatures
			}
		}
	},
	render(h) {
		const renderedMarkdown = unified()
			.use(markdown)
			.use(remarkExternalLinks, {
				target: '_blank',
				rel: ['noopener noreferrer']
			})
			.use(remarkDisableBlocks, this.remarkDisableOptions)
			.use(remark2rehype, {
				handlers: {
					component(toHast, node) {
						return toHast(node, node.component, { value: node.value })
					}
				}
			})
			.use(rehypeAddClasses, this.markdownCssClasses)
			.use(pluginComponent)
			.use(rehype2react, {
				createElement: (tag, attrs, children) => {
					if (!tag.startsWith('#')) {
						return h(tag, { attrs }, children)
					}

					const placeholder = this.arguments[tag.slice(1)]
					if (!placeholder) {
						return h('span', { ...{ attrs }, ...{ class: 'rich-text--fallback' } }, [`{${tag.slice(1)}}`])
					}

					if (!placeholder.component) {
						return h('span', { ...{ attrs } }, [placeholder])
					}

					return h(
						placeholder.component,
						{
							attrs,
							props: placeholder.props,
							class: 'rich-text--component'
						},
						children
					)
				},
				prefix: false
			})
			.processSync(this.text)
			.contents

		return h('div', { class: 'rich-text--wrapper' }, [renderedMarkdown])
	}
}
</script>

<style lang="scss" scoped>
.rich-text--wrapper {
	word-break: break-word;
	line-height: 1.5;
}

.rich-text--fallback, .rich-text-component {
	display: inline;
}

.rich-text--external-link:after {
	content: ' ↗';
}

.rich-text--list-element {
	list-style: initial;
	white-space: initial;
	color: var(--color-text-light);
	padding: initial;
	margin-left: 20px;

	li {
		padding: initial;
	}

	&.task-list-item {
		list-style: none;
		white-space: initial;
		color: var(--color-text-light);

		input {
			min-height: initial;
		}
	}
}

.rich-text--strong {
	white-space: initial;
	font-weight: bold;
	color: var(--color-text-light);
}

.rich-text--italic {
	white-space: initial;
	font-style: italic;
	color: var(--color-text-light);
}

.rich-text--heading {
	white-space: initial;
	font-size: initial;
	color: var(--color-text-light);
	margin-bottom: 5px;
	margin-top: 5px;
	font-weight: bold;

	&.rich-text--heading-1 {
		font-size: 20px;
	}

	&.rich-text--heading-2 {
		font-size: 19px;
	}

	&.rich-text--heading-3 {
		font-size: 18px;
	}

	&.rich-text--heading-4 {
		font-size: 17px;
	}

	&.rich-text--heading-5 {
		font-size: 16px;
	}

	&.rich-text--heading-6 {
		font-size: 15px;
	}
}

.rich-text--hr {
	border-top: 1px solid var(--color-border-dark);
	border-bottom: 0;
}

.rich-text--pre {
	border: 1px solid var(--color-border-dark);
	background-color: var(--color-background-dark);
	padding: 5px;
}

.rich-text--code {
	background-color: var(--color-background-dark);
}

.rich-text--blockquote {
	border-left: 3px solid var(--color-border-dark);
	padding-left: 5px;
}

.rich-text--table {
	border-collapse: collapse;

	thead tr th {
		border: 1px solid var(--color-border-dark);
		font-weight: bold;
		padding: 6px 13px;
	}

	tbody tr {
		td {
			border: 1px solid var(--color-border-dark);
			padding: 6px 13px;
		}

		&:nth-child(even) {
			background-color: var(--color-background-dark);
		}
	}
}
</style>
