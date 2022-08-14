<template>
	<span class="user">{{ user }}</span>
</template>

<script>
export default {
	name: 'UserBubble',
	props: {
		user: {
			type: String,
			default: ''
		}
	}
}
</script>

<style scoped>
.user {
	border-radius: 20px;
	border: 2px solid #0082c9;
	background-color: var(--color-background-dark);
	padding: 3px 8px;
}
</style>
