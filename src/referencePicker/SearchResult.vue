<template>
	<div class="result">
		<img
			class="result--image"
			:class="{ rounded: entry.rounded }"
			:src="entry.thumbnailUrl">
		<div class="result--content">
			<span class="result--content--title">
				<NcHighlight :search="query" :text="entry.title" />
			</span>
			<span class="result--content--subline">
				<NcHighlight :search="query" :text="entry.subline" />
			</span>
		</div>
	</div>
</template>

<script>
import NcHighlight from '@nextcloud/vue/dist/Components/NcHighlight.js'

export default {
	name: 'SearchResult',
	components: {
		NcHighlight,
	},
	props: {
		/**
		 * Unified search result entry
		 */
		entry: {
			type: Object,
			required: true,
		},
		/**
		 * The query that led to getting this result
		 * Used to highlight the entry text
		 */
		query: {
			type: String,
			required: true,
		},
	},
}
</script>

<style lang="scss" scoped>
.result {
	display: flex;
	align-items: center;
	height: 44px;
	overflow: hidden;

	&--image {
		width: 40px;
		min-width: 40px;
		height: 40px;
		object-fit: contain;

		&.rounded {
			border-radius: 50%;
		}
	}

	&--content {
		display: flex;
		flex-direction: column;
		padding-left: 10px;
		overflow: hidden;

		&--title,
		&--subline {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}
</style>
