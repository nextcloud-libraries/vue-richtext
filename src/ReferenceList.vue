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
import { getBuilder } from '@nextcloud/browser-storage'
import { generateOcsUrl } from '@nextcloud/router'
import { URL_PATTERN } from './helpers.js'
import sha1 from 'js-sha1'

const browserStorage = getBuilder('vue-richtext').clearOnLogout().build()

function getStorageKey(text, limit) {
	return `references-${sha1(text)}-${limit}`
}

function getReferences(text, limit) {
	const references = browserStorage.getItem(getStorageKey(text, limit))
	if (references) {
		const referenceObject = JSON.parse(references)
		if (referenceObject.expiry > Date.now()) {
			return referenceObject
		}
		browserStorage.removeItem(getStorageKey(text, limit))
	}
	return null
}

function setReferences(text, limit, references) {
	const expiry = Date.now() + 3600 * 1000
	const referenceJson = JSON.stringify({ ...references, expiry })
	browserStorage.setItem(getStorageKey(text, limit), referenceJson)
}

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
			default: 1
		}
	},
	data() {
		return {
			references: null,
			loading: true
		}
	},
	computed: {
		values() {
			return this.referenceData
				? this.referenceData
				: (this.references ? Object.values(this.references) : [])
		},
		firstReference() {
			return this.values[0] ?? null
		},
		displayedReferences() {
			return this.values.slice(0, this.limit)
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
				this.loading = false
				return
			}

			if (!(new RegExp(URL_PATTERN).exec(this.text))) {
				this.loading = false
				return
			}

			const cachedReferences = getReferences(this.text, this.limit)
			if (cachedReferences) {
				this.references = cachedReferences
				this.loading = false
				return
			}

			axios.post(generateOcsUrl('references/extract', 2), {
				text: this.text,
				resolve: true,
				limit: this.limit
			}).then((response) => {
				this.references = response.data.ocs.data.references
				setReferences(this.text, this.limit, this.references)
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
.widgets--list.icon-loading {
	min-height: 44px;
}
</style>
