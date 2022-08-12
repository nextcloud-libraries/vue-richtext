import { visit, SKIP } from 'unist-util-visit'
import { u } from 'unist-builder'

const Link = {
	name: 'Link',
	functional: true,
	props: {
		href: {
			type: String,
			required: true
		}
	},
	render(h, { data, props }) {
		return h('a', {
			attrs: {
				href: props.href,
				rel: 'noopener noreferrer',
				target: '_blank',
				class: 'rich-text--external-link'
			}
		}, [props.href.trim()])
	}
}

export const remarkAutolink = function({ autolink, useMarkdown }) {
	return function(tree) {

		if (!useMarkdown || !autolink) {
			return
		}

		visit(tree, (node) => node.type === 'text', (node, index, parent) => {
			let parsed = parseUrl(node.value, Link)
			parsed = parsed.map((n) => {
				if (typeof n === 'string') {
					return u('text', n)
				}

				return u('link', {
					url: n.props.href
				}, [u('text', n.props.href)])
			}).filter((x) => x)

			parent.children.splice(index, 1, ...parsed.flat())
			return [SKIP, index + parsed.flat().length]
		})
	}
}

const urlRegex = /(\s|\(|^)((https?:\/\/)((?:[-A-Z0-9+_]+\.)+[-A-Z]+(?::[0-9]+)?(?:\/[-A-Z0-9+&@#%?=~_|!:,.;()]*)*))(?=\s|\)|$)/ig
export const parseUrl = (text, linkComponent) => {
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
		list.push({ component: Link, props: { href } })
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
