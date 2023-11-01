import { create } from "./prisma/user"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { username, email, password, passwordConfirmation } = body

    if (!username)
        throw createError({
            statusCode: 400,
            statusMessage: 'The username field is required.'
        })
    else if (!email)
        throw createError({
            statusCode: 400,
            statusMessage: 'The email field is required.'
        })
    else if (!password)
        throw createError({
            statusCode: 400,
            statusMessage: 'The password field is required.'
        })
    else if (!passwordConfirmation)
        throw createError({
            statusCode: 400,
            statusMessage: 'The password confirmation field is required.'
        })
    else if (password !== passwordConfirmation)
        throw createError({
            statusCode: 400,
            statusMessage: 'The passwords do not match.'
        })

    const data = {
        username,
        email,
        password
    }

    const user = await create(data)
    return user
})