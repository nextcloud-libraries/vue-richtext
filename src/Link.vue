<template functional>
    <a :href="props.href.trim()" target="_blank">{{ props.href.trim() }}</a>
</template>
<script>
export default {
    name: 'Link',
    functional: true,
    props: {
        href: {
            type: String,
            required: true,
        }
    }
}
</script>