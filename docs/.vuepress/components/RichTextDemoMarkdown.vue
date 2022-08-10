<template>
	<div>
		<h4>Text input</h4>
		<textarea v-model="text" />
		<h4>Rendered output</h4>
		<RichText :text="text"
				  :arguments="args"
				  :autolink="true"
				  :use-markdown="useMarkdown"
				  class="bordered"/>
	</div>
</template>

<script>
import User from './User'
//import '@juliushaertl/vue-richtext/dist/vue-richtext.scss'

export default {
    name: 'RichTextDemoMarkdown',
    data: () => {
        return {
            text: `#### Components and Markdown
The **file** {file} was *added* by {username}.

#### Links

Autolink to https://example.com/file.csv works as well as or [md links](https://example.com/file.csv).

#### Unordered lists:
* {username}
* {file}
* …

#### Quotes

> Works!

#### Code

\`\`\`js
var x = cool;
\`\`\`

#### Tables

| Username   |      Files      |  Size |
|----------|:-------------:|------:|
| **{username}** |  {file} | [1024Kb](http://example.com) |
| {username1} |    {file1}   |   **8192Kb** |
| ~~{username2}~~ | ~~{file2}~~ |    ~~2048Kb~~ |
`,
			useMarkdown: true,
            args: {
                file: 'MyDocument.odt',
				file1: 'File 1.odt',
				file2: 'File 2.odt',
                username: {
                    component: User,
                    props: {
                        user: 'Jane Doe'
                    }
                },
				username1: {
					component: User,
					props: {
						user: 'Mr X'
					}
				},
				username2: {
					component: User,
					props: {
						user: 'John Doe'
					}
				}
            }
        }
    }
}
</script>

<style>
:root {
	--color-text-light: #4c4c4c;
	--color-border-dark: gray;
	--color-background-dark: lightgray;
}
</style>

<style scoped>
textarea {
	width: 100%;
	margin-bottom: 20px;
	min-height: 200px;
}

.bordered {
	border: 1px solid lightgrey;
}
</style>
