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
import RichText from '@juliushaertl/vue-richtext'
import User from './User.vue'

export default {
	name: 'Playground',
	components: {
		RichText
	},
	data() {
		return {
			text: 'Hello {username}. The file {file} was added by {username} **bold text**',
			autolink: true,
			useMarkdown: false,
			args: {
                file: 'MyDocument.odt',
                username: {
                    component: User,
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
