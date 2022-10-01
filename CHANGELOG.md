# Changelog

## v2.0.4 (2022-10-01)

#### :bug: Bug Fix
* [#805](https://github.com/nextcloud/vue-richtext/pull/805) Fix leading and trailing spaces on the URLs ([@nickvergessen](https://github.com/nickvergessen))

## v2.0.3 (2022-09-29)

#### :bug: Bug Fix
* [#800](https://github.com/nextcloud/vue-richtext/pull/800) Limit URL matching to http(s) ([@nickvergessen](https://github.com/nickvergessen))

## 2.0.2 (2022-09-28)

#### :rocket: Enhancement
* [#793](https://github.com/nextcloud/vue-richtext/pull/793) Use endpoint to fetch one reference in a cachable way ([@juliushaertl](https://github.com/juliushaertl))

#### :bug: Bug Fix
* [#792](https://github.com/nextcloud/vue-richtext/pull/792) Open links in a new tab ([@nickvergessen](https://github.com/nickvergessen))

## 2.0.1

### Fixes

- Only underline links which are not components. (#778)

## 2.0.0

### Breaking changes

A couple of rendering options have been removed due to complications with the
new remark/rehype versions. Those may be re-added in the future, but currently
are considered unsupported:

- `markdownCssClasses` have been dropped
- `disableMarkdownBlockFeatures` has been dropped
- `disableMarkdownInlineFeatures` has been dropped

### Enhancements

- Link preview using the server references APP (Requires Nextcloud 25)
- Plain text rendering is no longer using remark/rehype
- Bundling with vite and exposing es modules
