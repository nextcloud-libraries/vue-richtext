# Vue component for rich content strings 

[![Build Status](https://img.shields.io/travis/juliushaertl/vue-richtext.svg?style=flat-square)](https://travis-ci.org/juliushaertl/vue-richtext) [![npm last version](https://img.shields.io/npm/v/vue-richtext.svg?style=flat-square)](https://www.npmjs.com/package/vue-richtext) [![Dependabot status](https://img.shields.io/badge/Dependabot-enabled-brightgreen.svg?longCache=true&style=flat-square&logo=dependabot)](https://dependabot.com) [![irc](https://img.shields.io/badge/IRC-%23nextcloud--dev%20on%20freenode-blue.svg?style=flat-square)](https://webchat.freenode.net/?channels=nextcloud-dev)

This library provides a simple vue component to render text with rich placeholder replacements.

## Installation

```sh
npm install --save vue-richtext
```


## Usage

This library requires your app to have the following dependencies installed:

- vue 2.6

After that you can use the collection list component like this:

```vue
<template>
	<rich-text text="This text has some {extra} content: {details}"	/>
</template>

<script>
import RichText from 'vue-richtext'
import MyComponent from './example/MyComponent

export default {
    name: 'CollectionsView',
    components: {
        RichText
    },
    data: () => {
        return {
            attributes: {
                extra: 'extra'
                details: {
                    component: MyComponent,
                    props: {
                        user: 'admin'
                    }
                }
            }
        }
    }
}
</script>
```
