<template>
	<div class="widgets--list" :class="{'icon-loading': loading }">
		<div v-for="reference in displayedReferences" :key="reference.openGraphObject.id">
			<ReferenceWidget :reference="reference" />
		</div>
	</div>
</template>
<script>
import ReferenceWidget from './ReferenceWidget.vue'
import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'
import { isWidgetRegistered } from './widgets.js'
export default {
	name: 'ReferenceList',
	components: { ReferenceWidget },
	props: {
		text: {
			type: String,
			default: ''
		},
		referenceData: {
			type: Object,
			default: null
		},
		limit: {
			type: Number,
			default: 5
		}
	},
	data() {
		return {
			references: null,
			loading: true
		}
	},
	computed: {
		firstReference() {
			return this.references ? Object.values(this.references)[0] : null
		},
		displayedReferences() {
			return this.references ? Object.values(this.references).slice(0, this.limit) : null
		},
		hasCustomWidget() {
			return (reference) => isWidgetRegistered(reference.richObjectType)
		},
		noAccess() {
			return (reference) => reference && !reference.accessible
		}
	},
	watch: {
		text: 'fetch'
	},
	mounted() {
		this.fetch()
	},
	methods: {
		fetch() {
			this.loading = true
			if (this.referenceData) {
				this.references = this.referenceData
				this.loading = false
				return
			}

			axios.post(generateOcsUrl('references/extract', 2), {
				text: this.text,
				resolve: true,
				limit: this.limit
			}).then((response) => {
				this.references = response.data.ocs.data.references
				this.loading = false
			}).catch((error) => {
				console.error('Failed to extract references', error)
				this.loading = false
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.widgets--list {
	min-height: 44px;
}
</style>
