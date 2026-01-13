'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { createClient } from '@/utils/supabase/server'

async function checkAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized')
    }
    return user
}

export async function deleteRaffle(id: string) {
    await checkAdmin()

    try {
        await prisma.raffle.delete({
            where: { id },
        })
        revalidatePath('/admin/raffles')
        return { success: true }
    } catch (error) {
        console.error('Error deleting raffle:', error)
        return { success: false, error: 'Failed to delete raffle' }
    }
}

export async function updateRaffle(id: string, formData: FormData) {
    await checkAdmin()

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = "0.0"; // Free
    const imageUrl = formData.get('imageUrl') as string
    const status = formData.get('status') as string
    const startDateRaw = formData.get('startDate') as string
    const endDateRaw = formData.get('endDate') as string

    try {
        await prisma.raffle.update({
            where: { id },
            data: {
                name,
                description,
                price: parseFloat(price),
                imageUrl,
                status: status as 'OPEN' | 'CLOSED',
                startDate: startDateRaw ? new Date(startDateRaw) : null,
                endDate: endDateRaw ? new Date(endDateRaw) : null,
                showVideo: formData.get('showVideo') === 'on',
            },
        })
    } catch (error) {
        // In a real app we might return an error structure, but here we redirect or throw
        console.error('Failed to update raffle', error)
        // return { message: 'Failed to update raffle' }
    }

    revalidatePath('/admin/raffles')
    redirect('/admin/raffles')
}

export async function createRaffle(formData: FormData) {
    await checkAdmin()

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = "0.0"; // Free
    const imageUrl = formData.get('imageUrl') as string
    const startDateRaw = formData.get('startDate') as string
    const endDateRaw = formData.get('endDate') as string

    // Generate Slug
    const slug = name
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '') + '-' + Math.floor(Math.random() * 1000); // Append random number for uniqueness


    try {
        await prisma.raffle.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                imageUrl,
                status: 'OPEN',
                slug,
                startDate: startDateRaw ? new Date(startDateRaw) : null,
                endDate: endDateRaw ? new Date(endDateRaw) : null,
                showVideo: formData.get('showVideo') === 'on',
            },
        })
    } catch (error) {
        console.error('Failed to create raffle', error)
        // return { message: 'Failed to create raffle' }
    }

    revalidatePath('/admin/raffles')
    redirect('/admin/raffles')
}
