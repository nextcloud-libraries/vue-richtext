<template>
    <span class="user">{{ user }}</span>
</template>

<script>
export default {
	name: 'User',
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
	border-radius: 3px;
	background-color: #eee;
	padding: 3px;
}
</style>
