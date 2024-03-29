<template>
	<NcModal v-if="show"
		:size="modalSize"
		:can-close="false"
		class="reference-picker-modal"
		@close="onCancel">
		<div ref="modal_content"
			class="reference-picker-modal--content">
			<NcButton v-if="showBackButton"
				:aria-label="backButtonTitle"
				:title="backButtonTitle"
				class="back-button"
				@click="onBackClicked">
				<template #icon>
					<ArrowLeftIcon />
				</template>
			</NcButton>
			<NcButton
				:aria-label="closeButtonLabel"
				:title="closeButtonTitle"
				class="close-button"
				@click="onCancel">
				<template #icon>
					<CloseIcon />
				</template>
			</NcButton>
			<h2 v-if="showModalTitle">
				{{ modalTitle }}
			</h2>
			<ReferencePicker
				ref="referencePicker"
				:initial-provider="initialProvider"
				:focus-on-create="focusOnCreate"
				@provider-selected="onProviderSelect"
				@submit="onSubmit"
				@cancel="onCancel" />
		</div>
	</NcModal>
</template>

<script>
import ArrowLeftIcon from 'vue-material-design-icons/ArrowLeft.vue'
import CloseIcon from 'vue-material-design-icons/Close.vue'

import { NcModal, NcButton } from '@nextcloud/vue'
import { emit } from '@nextcloud/event-bus'

import ReferencePicker from './ReferencePicker.vue'
import { isCustomPickerElementRegistered } from './customPickerElements.js'
export default {
	name: 'ReferencePickerModal',
	components: {
		ReferencePicker,
		NcModal,
		NcButton,
		ArrowLeftIcon,
		CloseIcon,
	},
	props: {
		/**
		 * Provider to select on creation
		 * Show the provider list if no initial one is provided
		 */
		initialProvider: {
			type: Object,
			default: () => null,
		},
		/**
		 * Focus on the input item on create
		 */
		focusOnCreate: {
			type: Boolean,
			default: true,
		},
		/**
		 * If true, add the modal content to the Viewer trap elements via the event-bus
		 */
		isInsideViewer: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			show: true,
			selectedProvider: this.initialProvider,
			backButtonTitle: 'Back to provider selection',
			closeButtonTitle: 'Close',
			closeButtonLabel: 'Close link picker',
		}
	},
	computed: {
		isProviderSelected() {
			return this.selectedProvider !== null
		},
		showBackButton() {
			return this.initialProvider === null && this.isProviderSelected
		},
		modalSize() {
			return this.isProviderSelected && isCustomPickerElementRegistered(this.selectedProvider.id)
				? 'large'
				: 'normal'
		},
		showModalTitle() {
			return !this.isProviderSelected || !isCustomPickerElementRegistered(this.selectedProvider.id)
		},
		modalTitle() {
			return this.isProviderSelected
				? this.selectedProvider.title
				: 'Link picker'
		},
	},
	mounted() {
		if (this.isInsideViewer) {
			const elem = this.$refs.modal_content
			emit('viewer:trapElements:changed', elem)
		}
	},
	methods: {
		onCancel() {
			this.show = false
			this.$emit('cancel')
		},
		onSubmit(value) {
			this.show = false
			this.$emit('submit', value)
		},
		onProviderSelect(provider) {
			this.selectedProvider = provider
			// provider was deselected and we started with an inital one: just close the modal
			if (provider === null && this.initialProvider !== null) {
				this.onCancel()
			}
		},
		onBackClicked() {
			this.$refs.referencePicker.deselectProvider()
		},
	},
}
</script>

<style lang="scss">
// this is to avoid scroll on the container and leave it to the result block
.reference-picker-modal .modal-container {
	display: flex !important;
}
</style>

<style lang="scss" scoped>
.reference-picker-modal--content {
	padding: 12px 16px 16px 16px;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	overflow-y: auto;

	.close-button,
	.back-button {
		position: absolute;
		top: 4px;
	}
	.back-button {
		left: 4px;
	}
	.close-button {
		right: 4px;
	}

	> h2 {
		display: flex;
		margin-bottom: 20px;
		.icon {
			margin-right: 8px;
		}
	}
}
</style>
