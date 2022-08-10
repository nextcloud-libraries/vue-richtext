# Vue component for rich content strings 


This library provides a simple vue component to render text with rich placeholder replacements. The parameters that are replaced can either be a string or an object that allows rendering any Vue component into the text. Placeholders are wrapped in brackets, like `{placeholder}`.

## Installation

```sh
npm install --save @juliushaertl/vue-richtext
```


## Usage

- Input string: `The file {file} was added by {username}`
- Arguments: 
  - file: `'MyDocument'`
  - username: `{ component: User, props: { username: 'Jane Doe' }`


### Example output

<br />
<ClientOnly>
  <RichTextDemo />
</ClientOnly>
<br />

### Example source
<<< @/docs/.vuepress/components/RichTextDemo.vue

#### User.vue
<<< @/docs/.vuepress/components/User.vue
