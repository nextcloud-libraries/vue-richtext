<template>
	<div class="reference-picker"
		:style="pickerWrapperStyle"
		tabindex="-1"
		@keydown.stop.prevent.esc="onEscapePressed">
		<ProviderList v-if="mode === MODES.providerList"
			ref="provider-list"
			@select-provider="onProviderSelected"
			@submit="submitLink"
			@cancel="cancelProviderSelection" />
		<RawLinkInput v-else-if="mode === MODES.standardLinkInput"
			ref="url-input"
			:provider="selectedProvider"
			@submit="submitLink"
			@cancel="cancelRawLinkInput" />
		<Search v-else-if="mode === MODES.searchInput"
			ref="url-input"
			:provider="selectedProvider"
			@cancel="cancelSearch"
			@submit="submitLink" />
		<div v-else-if="mode === MODES.customElement"
			class="custom-element-wrapper">
			<CustomPickerElement
				:provider="selectedProvider"
				@submit="submitLink"
				@cancel="cancelCustomElement" />
		</div>
	</div>
</template>

<script>
import ProviderList from './ProviderList.vue'
import Search from './Search.vue'
import RawLinkInput from './RawLinkInput.vue'
import CustomPickerElement from './CustomPickerElement.vue'
import { isCustomPickerElementRegistered } from './customPickerElements.js'
import { touchProvider } from './providerHelper.js'

const MODES = {
	providerList: 1,
	standardLinkInput: 2,
	searchInput: 3,
	customElement: 4,
}
export default {
	name: 'ReferencePicker',
	components: {
		CustomPickerElement,
		RawLinkInput,
		ProviderList,
		Search,
	},
	props: {
		/**
		 * Provider to select on creation
		 * Default: null. Show the provider list
		 */
		initialProvider: {
			type: Object,
			default: () => null,
		},
		/**
		 * Optional width in pixels
		 * Default: 100%
		 */
		width: {
			type: Number,
			default: null,
		},
		/**
		 * Focus on the provider list select input on creation
		 * Default: true
		 */
		focusOnCreate: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			MODES,
			selectedProvider: this.initialProvider,
		}
	},
	computed: {
		mode() {
			return this.selectedProvider === null
				? MODES.providerList
				: isCustomPickerElementRegistered(this.selectedProvider.id)
					? MODES.customElement
					: this.selectedProvider.search_providers_ids
						? MODES.searchInput
						: MODES.standardLinkInput
		},
		pickerWrapperStyle() {
			return {
				width: this.width ? this.width + 'px' : undefined,
			}
		},
	},
	mounted() {
		if (this.focusOnCreate) {
			if (this.initialProvider) {
				setTimeout(() => {
					this.$refs['url-input']?.focus()
				}, 300)
			} else {
				this.$nextTick(() => {
					this.$refs['provider-list']?.focus()
				})
			}
		}

	},
	beforeDestroy() {
	},
	methods: {
		onEscapePressed() {
			if (this.selectedProvider !== null) {
				this.deselectProvider()
			} else {
				this.cancelProviderSelection()
			}
		},
		onProviderSelected(provider) {
			this.selectedProvider = provider
			this.$emit('provider-selected', provider)
			this.$nextTick(() => {
				this.$refs['url-input']?.focus()
			})
		},
		cancelCustomElement() {
			this.deselectProvider()
		},
		cancelSearch() {
			this.$emit('cancel-search', this.selectedProvider?.title)
			this.deselectProvider()
		},
		cancelRawLinkInput() {
			this.$emit('cancel-raw-link', this.selectedProvider?.title)
			this.deselectProvider()
		},
		cancelProviderSelection() {
			this.$emit('cancel')
		},
		submitLink(link) {
			if (this.selectedProvider !== null) {
				touchProvider(this.selectedProvider.id)
			}
			this.$emit('submit', link)
			this.deselectProvider()
		},
		deselectProvider() {
			this.selectedProvider = null
			this.$emit('provider-selected', null)
			setTimeout(() => {
				this.$refs['provider-list']?.focus()
			}, 300)
		},
	},
}
</script>

<style lang="scss" scoped>
.reference-picker {
	display: flex;
	overflow-y: auto;
	width: 100%;

	.custom-element-wrapper {
		display: flex;
		overflow-y: auto;
		width: 100%;
	}
}
</style>
