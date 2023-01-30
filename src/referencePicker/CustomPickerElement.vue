<template>
	<div ref="domElement" />
</template>

<script>
import { renderCustomPickerElement, isCustomPickerElementRegistered, destroyCustomPickerElement } from './customPickerElements.js'

export default {
	name: 'CustomPickerElement',
	props: {
		/**
		 * The reference provider
		 */
		provider: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			isRegistered: isCustomPickerElementRegistered(this.provider.id),
			renderResult: null,
		}
	},
	mounted() {
		if (this.isRegistered) {
			this.renderElement()
		}
	},
	beforeDestroy() {
		if (this.isRegistered) {
			destroyCustomPickerElement(this.provider.id, this.$el, this.renderResult)
		}
	},
	methods: {
		renderElement() {
			if (this.$refs.domElement) {
				this.$refs.domElement.innerHTML = ''
			}

			this.renderResult = renderCustomPickerElement(this.$refs.domElement, { providerId: this.provider.id, accessible: false })
			if (this.renderResult.object?._isVue && this.renderResult.object?.$on) {
				this.renderResult.object.$on('submit', this.onSubmit)
				this.renderResult.object.$on('cancel', this.onCancel)
			}
			this.renderResult.element.addEventListener('submit', (e) => {
				this.onSubmit(e.detail)
			})
			this.renderResult.element.addEventListener('cancel', this.onCancel)
		},
		onSubmit(value) {
			this.$emit('submit', value)
		},
		onCancel() {
			this.$emit('cancel')
		},
	},
}
</script>

<style lang="scss" scoped>
// nothing yet
</style>
