# Changelog

## 2.0.0 - Draft

### Breaking changes

A couple of rendering options have been removed due to complications with the
new remark/rehype versions. Those may be re-added in the future, but currently
are considered unsupported:

- `markdownCssClasses` have been dropped
- `disableMarkdownBlockFeatures` has been dropped
- `disableMarkdownInlineFeatures` has been dropped

### Enhancements

- Plain text rendering is no longer using remark/rehype
- Bundling with vite and exposing es modules
