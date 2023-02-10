# Changelog

## v2.1.0-beta.5 (2023-02-10)

#### :rocket: Enhancement
* [#904](https://github.com/nextcloud/vue-richtext/pull/904) Allow async renderCustomPickerElement ([@julien-nc](https://github.com/julien-nc))

#### Committers: 1
- Julien Veyssier ([@julien-nc](https://github.com/julien-nc))

## v2.1.0-beta.4 (2023-02-07)

#### :bug: Bug Fix
* [#896](https://github.com/nextcloud/vue-richtext/pull/896) fix getProvider not getting the 'any-link' fallback provider ([@julien-nc](https://github.com/julien-nc))
* [#897](https://github.com/nextcloud/vue-richtext/pull/897) fix the focus trap issue (after escape is pressed) when the link picker is displayed in the Viewer ([@julien-nc](https://github.com/julien-nc))

#### Committers: 1
- Julien Veyssier ([@julien-nc](https://github.com/julien-nc))

## v2.1.0-beta.3 (2023-02-03)

#### :rocket: Enhancement
* [#892](https://github.com/nextcloud/vue-richtext/pull/892) Make getLinkWithPicker simpler ([@julien-nc](https://github.com/julien-nc))

#### Committers: 1
- Julien Veyssier ([@julien-nc](https://github.com/julien-nc))

## v2.1.0-beta.1 (2023-01-30)

#### :rocket: Enhancement
* [#863](https://github.com/nextcloud/vue-richtext/pull/863) Implement reference picker ([@julien-nc](https://github.com/julien-nc))

#### Committers: 1
- Julien Veyssier ([@julien-nc](https://github.com/julien-nc))

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
