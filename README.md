# Vue component for rich content strings

[![npm last version](https://img.shields.io/npm/v/@juliushaertl/vue-richtext.svg?style=flat-square)](https://www.npmjs.com/package/@juliushaertl/vue-richtext) [![Dependabot status](https://img.shields.io/badge/Dependabot-enabled-brightgreen.svg?longCache=true&style=flat-square&logo=dependabot)](https://dependabot.com)

This library provides a simple vue component to render text with rich placeholder replacements.
The parameters that are replaced can either be a string or an object that allows rendering any Vue component into the text.
Placeholders are wrapped in brackets, like `{placeholder}`.
Markdown can be used for basic text formatting.

## Installation

```sh
npm install --save @juliushaertl/vue-richtext
```

## Usage

### Importing the vue component

```
import { RichText } from '@juliushaertl/vue-richtext'
```

### Importing the shipped stylesheets

```
@import '@juliushaertl/vue-richtext/dist/style.css';

```

## Basic usage with simple text placeholders

- Input string: `The file {file} was added…`
- Arguments:
  - file: `'MyDocument'`
- Renders: `The file 'MyDocument' was added…`

### Example usage:

```
<template>
	<RichText :text="text" :arguments="args" />
</template>

<script>
import RichText from '@juliushaertl/vue-richtext'
import UserBubble from './UserBubble'

export default {
    name: 'RichTextDemo',
	components: {
		RichText,
	},
    data: () => {
        return {
            text: 'The file {file} was added by {username}',
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
```

#### UserBubble.vue
```
<template>
    <span class="user">{{ user }}</span>
</template>

<script>
export default {
	name: 'UserBubble',
	props: {
		user: {
			type: String,
			default: ''
		}
	}
}
</script>

<style scoped>
.user {
	border-radius: 3px;
	background-color: #eee;
	padding: 3px;
}
</style>
```

## Usage with vue components

- Input string: `The file {file} was added by {username}`
- Arguments:
  - file: `'MyDocument'`
  - username: `{ component: UserBubble, props: { username: 'Jane Doe' }`
- Renders: `The file 'MyDocument' was added by <UserBubble>Jane Doe</UserBubble>`

## Usage with markdown

- Input string: `The **file** *{file}* was added by {username}`
- Arguments:
  - file: `'MyDocument'`
  - username: `{ component: UserBubble, props: { username: 'Jane Doe' }`
- Renders: `The <strong>file</strong> <i>'MyDocument'</i> was added by <UserBubble>Jane Doe</UserBubble>`

## Documentation

A full example is shown in the [documentation](https://juliushaertl.github.io/vue-richtext/)
