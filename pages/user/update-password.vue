<script setup>

import { useToast } from 'vue-toastification'

useHead({
    title: 'Update password'
})

definePageMeta({
    layout: 'auth',
    middleware: 'auth'
})

const toast = useToast()

const password = ref('')
const passwordConfirmation = ref('')
const errorMessage = ref()
const loading = ref(false)

async function updatePassword() {
    loading.value = true
    errorMessage.value = null
    const { error } = await useFetch('/api/user/update-password', {
        method: 'PUT',
        body: {
            password: password.value,
            passwordConfirmation: passwordConfirmation.value
        }
    })
    errorMessage.value = error.value?.data.statusMessage
    if (error.value) 
        loading.value = false
    else {
        await navigateTo('/user/account')
        toast.success("Password updated successfully!")
    }
}

</script>

<template>
    <AuthCard 
        title="Update password" 
        description="Enter a new secure password for your account"
    >
        <form @submit.prevent="updatePassword">
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
                    UPDATE PASSWORD
                </Button>
            </div>
        </form>
    </AuthCard>
</template>
