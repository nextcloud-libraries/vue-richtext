<template functional>
    <a :href="props.href" target="_blank">{{ props.href }}</a>
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