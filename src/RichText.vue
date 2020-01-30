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
		}
	},
	render(createElement) {
		// extract text nodes and placeholders and put them into an array that
		// contains a string for text and an object for each placeholder
		const placeholders = (' ' + this.text).split(/(?=(\{[a-z\-_0-9]+\}))/i).map((entry, index, list) => {
			const matches = entry.match(/^\{([a-z\-_0-9]+)\}$/i)

			// just return plain string nodes as text
			if (!matches || list[index] === list[index - 1]) {
				return entry.replace(/^\{[a-z\-_0-9]+\}/i, '')
			}

			// return component instance if argument is an object
			const argumentId = matches[1]
			const argument = this.arguments[argumentId]
			if (typeof argument === 'object') {
				const { component, props } = argument
				return createElement(component, {
					props,
					class: 'rich-text--component'
				})
			}

			// fallback if argument is a string or not set
			return createElement('strong', { class: 'rich-text--fallback' }, argument || argumentId)
		})

		// We currently need a space at the beginning of the string when splitting,
		// as otherwise the split with the positive lookahead fails to keep the first match in the list
		if (placeholders[0] === ' ') {
			placeholders.shift()
		}

		return createElement('div', { class: 'rich-text--wrapper' }, [
			...placeholders
		])
	}
}
</script>

<style scoped>
	.rich-text--fallback, .rich-text-component {
		display: inline;
	}
</style>
