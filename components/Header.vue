<script setup>

const { signOut } = useAuth()
const loggedIn = useStatus()

const navItems = [
    { id: 'home',      name: 'Home',      icon: 'home',          url: '/'               },
    { id: 'shop',      name: 'Shop',      icon: 'shopping-bag',  url: '/shop'           },
    { id: 'about',     name: 'About',     icon: 'document',      url: '/about'          },
]

const userNavItems = [
    { id: 'favorites', name: 'Favorites', icon: 'bookmark',      url: '/user/favorites' },
    { id: 'cart',      name: 'Cart',      icon: 'shopping-cart', url: '/user/cart'      }
]

const userOptions = (!loggedIn) ? [
    { id: 'login',     name: 'Log In',    icon: 'login',         url: '/auth/login'     },
    { id: 'register',  name: 'Register',  icon: 'register',      url: '/auth/register'  }
] : [
    { id: 'account',   name: 'Account',   icon: 'user',          url: '/user/account'   },
    { id: 'logout',    name: 'Log Out',   icon: 'logout',        action: 'signOut'      }
]

const favorites = useFavorites()
const cart = useCart()

const count = reactive({
    favorites: await favorites.getCount(),
    cart: await cart.getCount()
})

const bus = useEventBus('count')
bus.on(async function(event) {
    if (event === 'favorites')
        count.favorites = await favorites.getCount()
    if (event === 'cart')
        count.cart = await cart.getCount()
})

function handleAction(action) {
    if (action === 'signOut')
        signOut()
    else if (action === 'search') {
        const bus = useEventBus('modal')
        bus.emit('search')
    }
}

</script>

<template>
    <div class="fixed w-screen top-0 z-50 h-16 bg-gray-dark shadow-lg">
        <div class="grid grid-cols-3 px-3 md:px-10 max-w-5xl xl:max-w-8xl mx-auto h-full">
            <div class="flex md:hidden">
                <HeadlessMenu as="div" class="flex items-center" v-slot="{ open }">
                    <HeadlessMenuButton class="flex items-center text-white w-10 h-10 relative focus:outline-none" aria-label="mobile-menu">
                        <div class="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <span aria-hidden="true" class="block absolute h-0.5 w-5 bg-current transform transition duration-300 ease-in-out" :class="{ 'rotate-45': open,' -translate-y-1.5': !open }" />
                            <span aria-hidden="true" class="block absolute h-0.5 w-5 bg-current transform transition duration-300 ease-in-out" :class="{ 'opacity-0': open }" />
                            <span aria-hidden="true" class="block absolute h-0.5 w-5 bg-current transform transition duration-300 ease-in-out" :class="{ '-rotate-45': open, ' translate-y-1.5': !open }" />
                        </div>
                    </HeadlessMenuButton>
                    <Transition
                        enter-active-class="transition duration-300 ease-in-out"
                        enter-from-class="transform scale-y-0 opacity-0"
                        enter-to-class="transform scale-y-100"
                        leave-active-class="transition duration-300 ease-in-out"
                        leave-from-class="transform scale-y-100"
                        leave-to-class="transform scale-y-0 opacity-0"
                    >
                        <HeadlessMenuItems class="flex flex-col origin-top justify-center md:hidden absolute top-16 left-0 bg-gray-dark gap-y-2 p-5 pt-0 w-full shadow-2xl outline-none">
                            <Separator class="!p-0 !pb-2" />
                            <div class="flex flex-col gap-y-2 pb-2">
                                <HeadlessMenuItem v-for="item in navItems" :key="item.id">
                                    <NavItem 
                                        :label="item.name"
                                        :icon="item.icon"
                                        :url="item.url"
                                        :id="item.id"
                                    />
                                </HeadlessMenuItem>
                                <HeadlessMenuItem>
                                    <NavItem
                                        label="Search"
                                        icon="search"
                                        id="search"
                                        action="search"
                                        @action="handleAction"
                                    />
                                </HeadlessMenuItem>
                            </div>

                            <Separator class="!p-0" />
                            
                            <div class="flex flex-col gap-y-2 py-2">
                                <HeadlessMenuItem v-for="item in userNavItems" :key="item.id">
                                    <NavItem 
                                        :label="item.name"
                                        :icon="item.icon"
                                        :url="item.url"
                                        :id="item.id"
                                        :count="count[item.id]"
                                    />
                                </HeadlessMenuItem>
                            </div>

                            <Separator class="!p-0" />

                            <div class="flex flex-col gap-y-2 pt-2">
                                <HeadlessMenuItem v-for="option in userOptions" :key="option.id">
                                    <NavItem
                                        :label="option.name"
                                        :url="option.url"
                                        :icon="option.icon"
                                        :id="option.id"
                                        :action="option.action"
                                        @action="handleAction"
                                    />
                                </HeadlessMenuItem>
                            </div>
                        </HeadlessMenuItems>
                    </Transition>
                </HeadlessMenu>
            </div>
            <div class="col-start-2 justify-center flex flex-nowrap md:col-start-1 md:justify-start items-center">
                <NuxtLink to="/" class="flex items-center underline-effect">
                    <span class="text-red-primary transition duration-200 font-bold text-xl xl:text-2xl font-ubuntu whitespace-nowrap"> 
                        THE HEAVY SHOP
                    </span>
                </NuxtLink>
            </div>
            <button 
                @click="handleAction('search')" 
                aria-label="search"
                class="flex md:hidden items-center mr-2 outline-none w-fit h-fit justify-self-end self-center"
            >
                <IconsSearch class="text-white !size-7" />
            </button>
            <div class="hidden md:flex gap-x-3 items-center justify-center">
                <NavItem
                    v-for="item in navItems"
                    :key="item.id"
                    :label="item.name" 
                    :url="item.url"
                    :id="item.id"
                />
                <Button 
                    @click="handleAction('search')"
                    class="!w-fit !text-base !py-1.5 !pl-2.5"
                >
                    <IconsSearch class="text-white !size-[18px]" />
                    <span> Search </span>
                </Button>
            </div>
            <div class="hidden md:flex items-center justify-end mr-10">
                <div class="flex gap-x-4">
                    <NavItem
                        v-for="(item, index) in userNavItems"
                        :key="item.id"
                        :aria-label="item.id"
                        :icon="item.icon"
                        :url="item.url"
                        :class="index ? 'order-3' : 'order-1'"
                        :count="count[item.id]"
                    />
                    <Dropdown 
                        :options="userOptions" 
                        @action="handleAction" 
                        class="order-2"
                    >
                        <IconsUser 
                            aria-label="user-menu" 
                            class="text-white hover:text-red-primary transition duration-200" 
                        />
                    </Dropdown>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.underline-effect {
    position: relative;
}
.underline-effect::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    border-radius: 100px;
    background-color: #D4171E;
    bottom: 0;
    left: 0;
    transform-origin: right;
    transform: scaleX(0);
    transition: transform .4s;
}
.underline-effect:hover::before {
    transform-origin: left;
    transform: scaleX(1);
}

</style>
