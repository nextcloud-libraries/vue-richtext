<template>
	<div :class="{'icon-loading': loading }">
		<div v-for="reference in displayedReferences" :key="reference.openGraphObject.id">
			<ReferenceWidget :reference="reference" />
		</div>
	</div>
</template>
<script>
import ReferenceWidget from './ReferenceWidget.vue'

export default {
	name: 'References',
	components: { ReferenceWidget },
	props: {
		text: {
			type: String,
			default: ''
		},
		referenceData: {
			type: Object
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
			return (reference) => !!widgets[reference.richObjectType]
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

			fetch('http://nextcloud.dev.local/ocs/v2.php/references/extract?format=json', {
				method: 'POST',
				body: JSON.stringify({
					text: this.text,
					resolve: true,
					requesttoken: window.oc_requesttoken,
					limit: this.limit
				}),
				headers: {
					'Content-Type': 'application/json',
					requesttoken: window.oc_requesttoken
				}
			})
				.then(response => response.json())
				.then(json => {
					console.log(json)
					this.references = json.ocs.data.references
					this.loading = false
				})
				.catch(error => {
					console.error(error)
					this.loading = false
				})
		}
	}
}
</script>