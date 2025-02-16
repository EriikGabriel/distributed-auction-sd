import { Frown, Gavel } from "lucide-react"
import { AuctionCard } from "./AuctionCard"

export function ActiveAuctions() {
  const auctions = Array.from({ length: 5 }, (_, i) => i)

  return (
    <section className="flex flex-col gap-3 min-h-40 bg-neutral-100 border border-neutral-300 rounded-lg p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-700">
          Leilões ativos - {auctions.length}
        </h1>

        <button className="bg-neutral-900 hover:bg-neutral-900/90 text-white transition-all px-8 flex items-center justify-between gap-3 py-2 rounded font-bold">
          <Gavel className="size-5" /> Criar leilão
        </button>
      </div>

      {auctions.length !== 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 w-full h-full">
          {auctions.map((_, i) => (
            <AuctionCard key={i} />
          ))}
        </div>
      ) : (
        <div className="w-full bg-rd-500 h-full flex flex-col gap-5 items-center justify-center">
          <p className="text-neutral-500 text-center col-span-full">
            Nenhum leilão ativo no momento, volte mais tarde ou crie o seu
            próprio leilão.
          </p>
          <Frown className="mx-auto size-10 text-neutral-500" />
        </div>
      )}
    </section>
  )
}
