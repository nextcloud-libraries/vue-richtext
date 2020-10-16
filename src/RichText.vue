<!--
  - @copyright Copyright (c) 2020 Julius Härtl <jus@bitgrid.net>
  -
  - @author Julius Härtl <jus@bitgrid.net>
  - @author Guido Krömer <mail@cacodaemon.de>
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
					ol: 'rich-text--ordered-list',
					ul: 'rich-text--un-ordered-list',
					li: 'rich-text--list-item',
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
		useMarkdown: {
			type: Boolean,
			default: false
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
		disableHTML: {
			type: Boolean,
			default: true
		},
		autolink: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		remarkDisableOptions() {
			if (this.useMarkdown) {
				return {
					inline: [...(this.autolink ? [] : ['url']), ...(this.disableHTML ? ['html'] : []), ...this.disableMarkdownInlineFeatures],
					block: [ ...(this.disableHTML ? ['html'] : []), this.disableMarkdownBlockFeatures]
				}
			}

			return {
				inline: [
					...(this.autolink ? [] : ['url']),
					...[
						'escape',
						'autoLink',
						'email',
						'html',
						'link',
						'reference',
						'strong',
						'emphasis',
						'deletion',
						'code',
						'break'
						// 'text' // do not enable or pluginComponent's register will have no point to insert itself
					]
				],
				block: [
					'blankLine',
					'indentedCode',
					'fencedCode',
					'blockquote',
					'atxHeading',
					'thematicBreak',
					'list',
					'setextHeading',
					'html',
					'definition',
					'table'
					// 'paragraph' // do not disable we need at least one block quote rule to be enabled
				]
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
						return h(tag, attrs, children)
					}

					const placeholder = this.arguments[tag.slice(1)]
					if (!placeholder) {
						return h('span', { ...{ attrs }, ...{ class: 'rich-text--fallback' } }, [`{${tag.slice(1)}}`])
					}

					if (!placeholder.component) {
						return h('span', attrs, [placeholder])
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
			.result

		return h('div', { class: 'rich-text--wrapper' }, [renderedMarkdown])
	}
}
</script>

<style lang="scss" scoped>
@import "vue-richtext";
</style>
