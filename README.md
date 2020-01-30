# Vue component for rich content strings 

[![npm last version](https://img.shields.io/npm/v/@juliushaertl/vue-richtext.svg?style=flat-square)](https://www.npmjs.com/package/@juliushaertl/vue-richtext) [![Dependabot status](https://img.shields.io/badge/Dependabot-enabled-brightgreen.svg?longCache=true&style=flat-square&logo=dependabot)](https://dependabot.com)

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

## Documentation

A full example is shown in the [documentation](https://juliushaertl-vue-richtext.netlify.com/)
