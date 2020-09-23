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

## Basic usage with simple text placeholders

- Input string: `The file {file} was added…`
- Arguments:
  - file: `'MyDocument'`
- Renders: `The file 'MyDocument' was added…`

## Usage with vue components

- Input string: `The file {file} was added by {username}`
- Arguments:
  - file: `'MyDocument'`
  - username: `{ component: User, props: { username: 'Jane Doe' }`
- Renders: `The file 'MyDocument' was added by <User>Jane Doe</User>`

## Usage with markdown

- Input string: `The **file** *{file}* was added by {username}`
- Arguments:
  - file: `'MyDocument'`
  - username: `{ component: User, props: { username: 'Jane Doe' }`
- Renders: `The <strong>file</strong> <i>'MyDocument'</i> was added by <User>Jane Doe</User>`

## Documentation

A full example is shown in the [documentation](https://juliushaertl-vue-richtext.netlify.com/)

## TODO

* Fix `rollup.config.js`
  * [ ] Handle dependencies e.g. rehype, remark…
  * [ ] Extract styles to separate files (.css, .scss, .less)
  * [ ] eslint is currently disabled
