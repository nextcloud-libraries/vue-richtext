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
import Link from './Link.vue'
import { unified } from 'unified'
import markdown from 'remark-parse'
import breaks from 'remark-breaks'
import remark2rehype from 'remark-rehype'
import rehype2react from 'rehype-react'
import remarkExternalLinks from 'remark-external-links'
import rehypeAddClasses from 'rehype-add-classes'
import { visit } from 'unist-util-visit'
import { u } from 'unist-builder'
import {toString} from 'mdast-util-to-string'

import {fromMarkdown} from 'mdast-util-from-markdown'

import {
  gfmAutolinkLiteral
} from 'micromark-extension-gfm-autolink-literal'
import {
  gfmAutolinkLiteralFromMarkdown
} from 'mdast-util-gfm-autolink-literal'


const urlRegex = /(\s|\(|^)((https?:\/\/)((?:[-A-Z0-9+_]+\.)+[-A-Z]+(?::[0-9]+)?(?:\/[-A-Z0-9+&@#%?=~_|!:,.;()]*)*))(?=\s|\)|$)/ig
const parseUrl = (text, linkComponent) => {
	let match = urlRegex.exec(text)
	const list = []
	let start = 0
	while (match !== null) {
		let href = match[2]
		let textAfter
		let textBefore = text.substring(start, match.index + match[1].length)
		if (href[0] === ' ') {
			textBefore += href[0]
			href = href.substring(1).trim()
		}
		const lastChar = href[(href.length - 1)]
		if (lastChar === '.' || lastChar === ',' || lastChar === ';' || (match[0][0] === '(' && lastChar === ')')) {
			href = href.substring(0, href.length - 1)
			textAfter = lastChar
		}
		list.push(textBefore)
		list.push({ component: linkComponent, props: { href } })
		if (textAfter) {
			list.push(textAfter)
		}
		start = match.index + match[0].length
		match = urlRegex.exec(text)
	}
	list.push(text.substring(start))
	const joinedText = list.map((item) => typeof item === 'string' ? item : item.props.href).join('')
	if (text === joinedText) {
		return list
	}
	console.error('Failed to reassemble the chunked text: ' + text)
	return text
}
const prepareTextNode = ({ h, context }, text) => {
	if (context.autolink) {
		text = parseUrl(text, Link)
	}
	if (Array.isArray(text)) {
		return text.map((entry) => {
			if (typeof entry === 'string') {
				return entry
			}
			const { component, props } = entry
			return h(component, {
				props,
				class: 'rich-text--component'
			})
		})
	}
	return text
}


function transformer(ast) {
	visit(ast, (node) => node.type === 'text', visitor)

	function visitor(node, index, parent) {
		const placeholders = node.value.split(/(\{[a-z\-_.0-9]+\})/ig)
			.map((entry, index, list) => {
				const matches = entry.match(/^\{([a-z\-_.0-9]+)\}$/i)
				// just return plain string nodes as text
				if (!matches) {
					return u('text', entry)
				}
				const [, component] = matches
				return u('element', {
					tagName: `#${component}`,
				})
			})

		node = u('element', { tagName: 'span' }, [
			...placeholders
		])
		parent.children[index] = node
	}
}

function pluginComponent() {
	return transformer
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
	render(h) {
		const useMarkdown = this.useMarkdown
		const autolink = this.autolink
		const context = this

		if (!useMarkdown) {
			const placeholders = this.text.split(/(\{[a-z\-_.0-9]+\})/ig).map(function(entry, index, list) {
				const matches = entry.match(/^\{([a-z\-_.0-9]+)\}$/i)
				// just return plain string nodes as text
				if (!matches) {
					return prepareTextNode({ h, context }, entry)
				}
				// return component instance if argument is an object
				const argumentId = matches[1]
				const argument = context.arguments[argumentId]
				if (typeof argument === 'object') {
					const { component, props } = argument
					return h(component, {
						props,
						class: 'rich-text--component'
					})
				}
				if (argument) {
					return h('span', { class: 'rich-text--fallback' }, argument)
				}
				return entry
			})
			return h('div', { class: 'rich-text--wrapper' }, placeholders.flat())
		}

		const renderedMarkdown = unified()
			.use(markdown)
			.use(function() {
				return function(tree) {
					if (!useMarkdown || !autolink) {
						return
					}

					visit(tree, (node) => node.type === 'text', (node, index, parent) => {
						const subtree = fromMarkdown(node.value, {
							extensions: [gfmAutolinkLiteral],
							mdastExtensions: [gfmAutolinkLiteralFromMarkdown]
						})
						console.log(node.value, newChilds)
						parent.children = [
							...parent.children.slice(0, index),
							...subtree.children,
							...parent.children.slice(index + 1),
						]
					})
				}
			})
			.use(remarkExternalLinks, {
				target: '_blank',
				rel: ['noopener noreferrer']
			})
			.use(breaks)
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
