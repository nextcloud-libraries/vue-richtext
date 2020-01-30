<template>
	<RichText :text="text" :arguments="args" />
</template>

<script>

import User from './User'

export default {
    name: 'RichTextDemo',
    data: () => {
        return {
            text: 'The file {file} was added by {username}',
            args: {
                file: 'MyDocument.odt',
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