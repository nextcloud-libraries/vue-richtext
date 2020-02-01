<!--
  - @copyright Copyright (c) 2020 Julius Härtl <jus@bitgrid.net>
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
import Link from './Link'

const urlRegex = /(\s|\(|^)(https?:\/\/)((?:[-A-Z0-9+_]+\.)+[-A-Z]+(?:\/[-A-Z0-9+&@#%?=~_|!:,.;()]*)*)(?=\s|\)|$)/ig

const parseUrl = (text) => {
	let match = urlRegex.exec(text)
	const list = []
	let start = 0
	while (match !== null) {
		let href = match[0]
		let textBefore = text.substring(start, match.index)
		if (href[0] === ' ' || href[0] === '(') {
			textBefore += href[0]
			href = href.substring(1)
		}

		list.push(textBefore)
		list.push({ component: Link, props: { href: href.trim() } })
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
	if (context.props.autolink) {
		text = parseUrl(text)
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

export default {
	name: 'RichText',
	functional: true,
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
		autolink: {
			type: Boolean,
			default: false
		}
	},
	render: function(h, context) {
		// extract text nodes and placeholders and put them into an array that
		// contains a string for text and an object for each placeholder
		const placeholders = (' ' + context.props.text).split(/(?=(\{[a-z\-_0-9]+\}))/i).map((entry, index, list) => {
			const matches = entry.match(/^\{([a-z\-_0-9]+)\}$/i)

			// just return plain string nodes as text
			if (!matches || list[index] === list[index - 1]) {
				const text = entry.replace(/^\{[a-z\-_0-9]+\}/i, '')
				return prepareTextNode({ h, context }, text)
			}

			// return component instance if argument is an object
			const argumentId = matches[1]
			const argument = context.props.arguments[argumentId]
			if (typeof argument === 'object') {
				const { component, props } = argument
				return h(component, {
					props,
					class: 'rich-text--component'
				})
			}

			// fallback if argument is a string or not set
			return h('strong', { class: 'rich-text--fallback' }, argument || argumentId)
		})

		// We currently need a space at the beginning of the string when splitting,
		// as otherwise the split with the positive lookahead fails to keep the first match in the list
		if (placeholders[0] === ' ') {
			placeholders.shift()
		}

		return h('div', { class: 'rich-text--wrapper' }, placeholders.flat())
	}
}
</script>

<style scoped>
	.rich-text--fallback, .rich-text-component {
		display: inline;
	}
</style>
