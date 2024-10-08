import { PrismaClient, Item } from '@prisma/client'
const prisma = new PrismaClient()
export default prisma

async function getUserByEmail(email: string | null | undefined) {
    try {
        const { createdAt, ...user } = await prisma.user.findUniqueOrThrow({
            where: {
                email: email as string
            },
            select: {
                id: true,
                name: true,
                email: true,
                photoUrl: true,
                createdAt: true
            }
        })
        return { ...user, registeredOn: dateFormatter(createdAt) }
    }
    catch(e) { 
        if (email)
            throw createError({
                statusCode: 500,
                statusMessage: 'We couldn\'t find that account.'
            })
    }
}

function getItemRating(item: any) {
    if (item.reviews?.length === 0)
        return 0
    return item.reviews?.map((review: any) => review?.rating).reduce((x: any, y: any) => x + y, 0) / item.reviews?.length
}

function dateFormatter(date: any) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })
}

export { getUserByEmail, getItemRating, dateFormatter }
