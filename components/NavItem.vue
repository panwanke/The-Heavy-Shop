<script setup>

import { IconsHome, IconsUser, IconsLogin, IconsLogout, IconsSearch, IconsRegister, IconsBookmark, IconsDocument, IconsShoppingBag, IconsShoppingCart } from '#components'

const props = defineProps({
    action: String,
    label: String,
    icon: String,
    url: String,
    count: Number
})

const emit = defineEmits(['action'])

const route = useRoute()
const router = useRouter()

function match(url) {
    return '/' + route.name?.replace('-', '/') === url || route.name === 'index' && url === '/'
}

function handleClick() {
    if (props.url)
        router.push({ path: props.url })
    else if (props.action)
        emit('action', props.action)
}

const icon = computed(() => {
    return {
        'home'          : IconsHome,
        'user'          : IconsUser,
        'login'         : IconsLogin,
        'logout'        : IconsLogout,
        'search'        : IconsSearch,
        'register'      : IconsRegister,
        'document'      : IconsDocument,
        'bookmark'      : IconsBookmark,
        'shopping-bag'  : IconsShoppingBag,
        'shopping-cart' : IconsShoppingCart
    }[props.icon]
})

</script>

<template>
    <button 
        @click="handleClick" 
        class="relative flex items-center outline-none"
    >
        <div v-if="count" class="font-ubuntu text-white order-2">
            <div class="hidden md:block bg-red-light rounded-full absolute size-4 -top-1.5 -right-1.5 pt-[0.5px] text-[10px]">
                {{ count }}
            </div>
            <div class="ml-2 flex md:hidden bg-red-light rounded-full size-5 items-center justify-center text-xs">
                {{ count }}
            </div>
        </div>
        <div 
            :class="[
                match(url) ? 'text-red-primary' : 'text-white',
                'flex items-center gap-x-2 text-lg text-left hover:text-red-primary transition duration-200'
            ]"
        >
            <component v-if="icon" :is="icon" />
            <span v-if="label"> {{ label }} </span>
        </div>
    </button>
</template>
