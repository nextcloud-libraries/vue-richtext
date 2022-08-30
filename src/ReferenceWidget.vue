<template>
	<div>
		<div v-if="reference && hasCustomWidget" class="widget-custom">
			<div ref="customWidget" />
		</div>

		<div v-else-if="noAccess" class="widget-access">
			<p>You may not have access to this reference!</p>
		</div>

		<a v-else-if="reference && reference.openGraphObject && !hasCustomWidget" :href="reference.openGraphObject.link" class="widget-default">
			<div v-if="reference.openGraphObject.thumb" class="widget-default--image" :style="{ 'backgroundImage': 'url(' + reference.openGraphObject.thumb + ')' }" />
			<div class="widget-default--details">
				<p class="widget-default--title">{{ reference.openGraphObject.name }}</p>
				<p class="widget-default--description">{{ reference.openGraphObject.description }}</p>
				<p class="widget-default--link">{{ reference.openGraphObject.link }}</p>
			</div>
		</a>
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
				renderWidget(this.$refs.customWidget, this.reference)
			})
		}
	}
}
</script>
<style lang="scss" scoped>

@mixin widget {
	width: 100%;
	margin: auto;
	margin-bottom: 12px;
	margin-top: 12px;
	overflow: hidden;
	border: 2px solid var(--color-border);
	border-radius: var(--border-radius-large);
	background-color: transparent;
	display: flex;
}

.widget-custom {
	@include widget;
}

.widget-access {
	@include widget;
	padding: 12px;
}

.widget-default {
	@include widget;

	&--image {
		width: 40%;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
	}

	&--title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: bold;
	}

	&--details {
		padding: 12px;
		width: 60%;

		p {
			margin: 0;
			padding: 0;
		}
	}

	&--description {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	&--link a {
		color: var(--color-text-maxcontrast);
	}
}
</style>
