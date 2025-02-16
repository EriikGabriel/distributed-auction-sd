import { CopyX } from "lucide-react"
import { AuctionCard } from "./AuctionCard"

export function ClosedAuctions() {
  const closedAuctions = Array.from({ length: 2 }, (_, i) => i)

  return (
    <section className="flex flex-col gap-3 min-h-40 bg-neutral-100 border border-neutral-300 rounded-lg p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-700">
          Leilões encerrados - {closedAuctions.length}
        </h1>
      </div>

      {closedAuctions.length !== 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 w-full h-full">
          {closedAuctions.map((_, i) => (
            <AuctionCard key={i} isClosed />
          ))}
        </div>
      ) : (
        <div className="w-full bg-rd-500 h-full flex flex-col gap-5 items-center justify-center">
          <p className="text-neutral-500 text-center col-span-full">
            Os leilões encerrados aparecerão aqui, volte mais tarde.
          </p>
          <CopyX className="mx-auto size-10 text-neutral-500" />
        </div>
      )}
    </section>
  )
}
