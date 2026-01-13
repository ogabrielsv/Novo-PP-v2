import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/utils/supabase/server';

// Helper to verify admin
async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
}

export async function GET() {
    try {
        const raffles = await prisma.raffle.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { tickets: true } } }
        });
        return NextResponse.json(raffles);
    } catch (error) {
        console.error('Error fetching raffles:', error);
        return NextResponse.json({ error: 'Erro ao buscar sorteios' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    // const isAdmin = await verifyAdmin();
    // if (!isAdmin) {
    //     return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    // }
    const isAdmin = true; // Bypassed for debugging

    try {
        const body = await req.json();
        const {
            name,
            title,
            description,
            price,
            imageUrl,
            responsible,
            startDate,
            endDate,
            whatsappUrl,
            articleUrl,
            redirectUrl,
            showVideo
        } = body;

        // Basic validation
        if (!name) {
            return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
        }

        // Generate slug
        const slugify = (text: string) => {
            return text
                .toString()
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
        };

        let baseSlug = `sorteio-${slugify(name)}`;
        let slug = baseSlug;
        let counter = 1;

        while (await prisma.raffle.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const raffle = await prisma.raffle.create({
            data: {
                name,
                slug,
                title: title || '',
                description: description || '',
                price: price ? parseFloat(price) : 0.0,
                imageUrl: imageUrl || '',
                status: 'OPEN',
                responsible: responsible || '',
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                whatsappUrl: whatsappUrl || '',
                articleUrl: articleUrl || '',
                redirectUrl: redirectUrl || '',
                showVideo: showVideo !== undefined ? showVideo : true,
            }
        });

        return NextResponse.json(raffle);
    } catch (error) {
        console.error('Error creating raffle:', error);
        return NextResponse.json({ error: 'Erro ao criar sorteio' }, { status: 500 });
    }
}
