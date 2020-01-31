<template>
    <div>
        <h4>Text input</h4>
        <textarea v-model="text" />
        <h4>Rendered output</h4>
	    <RichText :text="text" :arguments="args" :autolink="true" />
    </div>
</template>

<script>
import User from './User'

export default {
    name: 'RichTextDemo',
    data: () => {
        return {
            text: '{username} added a bookmark for https://example.com/',
            args: {
                username: {
                    component: User,
                    props: {
                        user: 'Jane Doe'
                    }
                }
            }
        }
    }
}
</script>
<style scoped>
textarea {
    width: 100%;
    min-height: 40px;
    margin-bottom: 20px;
}
</style>