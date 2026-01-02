import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Ticket, ArrowRight, Gift } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const raffles = await prisma.raffle.findMany({
    where: { status: 'OPEN' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navbar */}
      <nav className="border-b border-stone-900 bg-black/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            Play<span className="text-blue-600">Prêmios</span>
          </div>
          <Link
            href="/admin/login"
            className="text-sm font-medium text-stone-400 hover:text-white transition-colors"
          >
            Área Admin
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-20 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 bg-gradient-to-br from-white to-stone-500 bg-clip-text text-transparent">
          Prêmios Exclusivos
          <br />
          <span className="text-blue-600">Ao Seu Alcance</span>
        </h1>
        <p className="text-stone-400 text-lg max-w-2xl mx-auto mb-10">
          Participe dos nossos sorteios e concorra a prêmios incríveis.
          Segurança, transparência e chances reais de ganhar.
        </p>
      </div>

      {/* Raffles Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Gift className="text-blue-500" />
          Sorteios Ativos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {raffles.length === 0 ? (
            <div className="col-span-full py-16 text-center border border-stone-900 rounded-2xl bg-stone-950">
              <p className="text-stone-500">Nenhum sorteio ativo no momento.</p>
            </div>
          ) : (
            raffles.map((raffle) => (
              <Link
                key={raffle.id}
                href={`/raffle/${raffle.id}`}
                className="group bg-stone-950 border border-stone-900 rounded-2xl overflow-hidden hover:border-blue-800 transition-all hover:scale-[1.01] hover:shadow-2xl hover:shadow-blue-900/10"
              >
                <div className="aspect-video bg-stone-900 relative">
                  {raffle.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={raffle.imageUrl}
                      alt={raffle.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-800">
                      <Gift className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    R$ {raffle.price.toFixed(2)}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                    {raffle.name}
                  </h3>
                  <p className="text-stone-500 text-sm line-clamp-2 mb-6">
                    {raffle.description || 'Sem descrição.'}
                  </p>

                  <div className="flex items-center justify-between text-sm font-medium">
                    <div className="flex items-center gap-2 text-stone-400">
                      <Ticket className="w-4 h-4" />
                      Participar
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <footer className="border-t border-stone-900 py-12 text-center text-stone-600 text-sm">
        <p>&copy; {new Date().getFullYear()} PlayPrêmios. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
