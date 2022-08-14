<template>
	<div>
		<textarea v-model="text" />

		<p>
			<label for="autolink">
				<input id="autolink" v-model="autolink" type="checkbox">
				Autolink
			</label>
		</p>

		<p>
			<label for="useMarkdown">
				<input id="useMarkdown" v-model="useMarkdown" type="checkbox">
				Use Markdown
			</label>
		</p>

		<RichText
			:text="text" :autolink="autolink" :arguments="args"
			:use-markdown="useMarkdown" />
	</div>
</template>
<script>
// eslint-disable-next-line node/no-missing-import
import RichText from '@juliushaertl/vue-richtext'
import UserBubble from './UserBubble.vue'

export default {
	name: 'DemoPlayground',
	components: {
		RichText
	},
	data() {
		return {
			text: `Hello {username}. The file {file} was added by {username}. Go visit https://nextcloud.com

Some examples for markdown syntax: **bold text** *italic text* ~~strikethrough~~`,
			autolink: true,
			useMarkdown: false,
			args: {
				file: 'MyDocument.odt',
				username: {
					component: UserBubble,
					props: {
						user: 'Jane Doe'
					}
				}
			}
		}
	}
}
</script>
<style lang="scss">
textarea {
    width: 100%;
    height: 100px;
}
</style>
