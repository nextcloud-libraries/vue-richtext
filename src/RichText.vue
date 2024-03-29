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
import { unified } from 'unified'
import ReferenceList from './ReferenceList.vue'
import markdown from 'remark-parse'
import breaks from 'remark-breaks'
import remark2rehype from 'remark-rehype'
import rehype2react from 'rehype-react'
import remarkExternalLinks from 'remark-external-links'
// import rehypeAddClasses from 'rehype-add-classes'
import { remarkAutolink } from './autolink.js'
import { remarkPlaceholder, prepareTextNode } from './placeholder.js'

export default {
	name: 'RichText',
	components: {
		ReferenceList
	},
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
		referenceLimit: {
			type: Number,
			default: 0
		},
		/** Provide data upfront to avoid extra http request */
		references: {
			type: Object,
			default: null
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
		autolink: {
			type: Boolean,
			default: true
		}
	},
	methods: {
		renderPlaintext(h) {
			const context = this
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
			return h('div', { class: 'rich-text--wrapper' }, [
				h('div', {}, placeholders.flat()),
				this.referenceLimit > 0
					? h('div', { class: 'rich-text--reference-widget' }, [
						h(ReferenceList, { props: { text: this.text, referenceData: this.references } })
					])
					: null
			])
		},
		renderMarkdown(h) {
			const renderedMarkdown = unified()
				.use(markdown)
				.use(remarkAutolink, {
					autolink: this.autolink,
					useMarkdown: this.useMarkdown
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
				// .use(rehypeAddClasses, this.markdownCssClasses)
				.use(remarkPlaceholder)
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

			return h('div', { class: 'rich-text--wrapper' }, [
				renderedMarkdown,
				this.referenceLimit > 0
					? h('div', { class: 'rich-text--reference-widget' }, [
						h(ReferenceList, { props: { text: this.text, referenceData: this.references } })
					])
					: null
			])
		}
	},
	render(h) {
		if (!this.useMarkdown) {
			return this.renderPlaintext(h)
		}

		return this.renderMarkdown(h)
	}
}
</script>
<style scoped>
a:not(.rich-text--component) {
	text-decoration: underline;
}
</style>
