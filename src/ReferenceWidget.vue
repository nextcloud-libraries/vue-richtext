<template>
	<div>
		<div v-if="noAccess" class="widget-default">
			<p>You may not have access to this reference!</p>
		</div>

		<div v-else-if="reference && hasCustomWidget" ref="customWidget" class="widget-custom" />

		<div v-else-if="reference && reference.openGraphObject && !hasCustomWidget" class="widget-default">
			<div v-if="reference.openGraphObject.thumb" class="widget-default--image" :style="{ 'backgroundImage': 'url(' + reference.openGraphObject.thumb + ')' }" />
			<p class="widget-default--title">
				<strong>{{ reference.openGraphObject.name }}</strong>
			</p>
			<p class="widget-default--description">
				{{ reference.openGraphObject.description }}
			</p>
			<p class="widget-default--link">
				<a :href="reference.openGraphObject.link" target="_blank">{{ reference.openGraphObject.link }}</a>
			</p>
		</div>
	</div>
</template>
<script>
import { renderWidget, isWidgetRegistered } from './widgets.js'

export default {
	name: 'ReferenceWidget',
	props: {
		reference: {
			type: Object,
			required: true
		}
	},
	data() {
		return {}
	},
	computed: {
		hasCustomWidget() {
			return isWidgetRegistered(this.reference.richObjectType)
		},
		noAccess() {
			return this.reference && !this.reference.accessible
		}
	},
	mounted() {
		this.renderWidget()
	},
	methods: {
		renderWidget() {
			if (this.$refs.customWidget) {
				this.$refs.customWidget.innerHTML = ''
			}
			if (this?.reference?.richObjectType === 'open-graph') {
				return
			}
			this.$nextTick(() => {
				// Waiting for the ref to become available
				renderWidget(this.reference.richObjectType, this.reference.richObject, this.$refs.customWidget)
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.widget-custom {
	max-width: 500px;
	margin: auto;
	margin-bottom: 10px;
	padding: 12px;
	border-radius: var(--border-radius-large);
	background-color: var(--color-primary-light);
}

.widget-default {
	max-width: 500px;
	margin: auto;
	margin-bottom: 10px;
	padding: 12px;
	border-radius: var(--border-radius-large);
	background-color: var(--color-background-dark);

	&--image {
		// FIXME: open graph images are likely 1.91:1 ratio
		height: 260px;
		width: 500px;
		background-position: center;
		background-size: cover;
	}

	&--link a {
		color: var(--color-text-maxcontrast);
	}
}
</style>
