<script setup>

import { useToast } from 'vue-toastification'

useHead({
    title: 'Reset password'
})

definePageMeta({
    layout: 'auth',
    middleware: 'auth',
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/',
    },
})

const toast = useToast()
const route = useRoute()
const { signIn } = useAuth()

const password = ref('')
const passwordConfirmation = ref('')
const errorMessage = ref()
const loading = ref(false)

async function resetPassword() {
    loading.value = true
    errorMessage.value = null
    const { data, error } = await useFetch('/api/auth/reset-password', {
        method: 'PUT',
        body: {
            signedToken: route.query.token,
            password: password.value,
            passwordConfirmation: passwordConfirmation.value
        }
    })
    errorMessage.value = error.value?.data.statusMessage
    if (error.value)
        loading.value = false
    else {
        await signIn('credentials', {
            email: data.value.email,
            password: password.value,
            redirect: false
        })
        await navigateTo('/')
        toast.success("Password reset successfully!")
    }
}

</script>

<template>
    <AuthCard 
        title="Reset password" 
        description="Enter a new secure password for your account"
    >
        <form @submit.prevent="resetPassword">
            <div class="flex flex-col gap-4">
                <div>
                    <Label for="password"> Password </Label>
                    <TextInput 
                        v-model="password" 
                        name="password" 
                        id="password" 
                        type="password"
                    >
                        <IconsKey class="text-white" />
                    </TextInput>
                </div>
                <div>
                    <Label for="password-confirmation"> Password confirmation </Label>
                    <TextInput 
                        v-model="passwordConfirmation" 
                        name="password-confirmation" 
                        id="password-confirmation" 
                        type="password"
                    >
                        <IconsKey class="text-white" />
                    </TextInput>
                </div>
                <Error> {{ errorMessage }} </Error>
                <Button 
                    type="submit" 
                    :variant="loading ? 'loading' : 'primary'"
                >
                    RESET PASSWORD
                </Button>
            </div>
        </form>
    </AuthCard>
</template>
