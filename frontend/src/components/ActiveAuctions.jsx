import { Frown, Gavel } from "lucide-react"
import { useEffect, useState } from "react"
import { createAuction, getAuctions } from "../api/services"
import { AuctionCard } from "./AuctionCard"
import { AuctionModal } from "./AunctionModal"

export function ActiveAuctions() {
  const [auctions, setAuctions] = useState([])
  const [modalType, setModalType] = useState(null)
  const [selectedAuction, setSelectedAuction] = useState(null)

  useEffect(() => {
    const fetchActiveAuctions = async () => {
      try {
        const response = await getAuctions()
        const activeAuctions = response.data.filter(
          (auction) => auction.active == "true"
        )
        setAuctions(activeAuctions)
      } catch (error) {
        console.error("Error fetching active auctions:", error)
      }
    }

    fetchActiveAuctions()
  }, [auctions])

  const handleCreateAuction = async (auctionData) => {
    try {
      const response = await createAuction(auctionData)

      // Atualiza a lista de leilões após a criação
      setAuctions((prev) => [...prev, response.data["result"]])
    } catch (error) {
      console.error("Error creating auction:", error)
    }
  }

  return (
    <section className="flex flex-col gap-3 min-h-40 bg-neutral-100 border border-neutral-300 rounded-lg p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-700">
          Leilões ativos - {auctions.length}
        </h1>
        <button
          className="bg-neutral-900 hover:bg-neutral-900/90 text-white transition-all px-8 flex items-center justify-between gap-3 py-2 rounded font-bold"
          onClick={() => {
            setModalType("create")
            setSelectedAuction(null)
          }}
        >
          <Gavel className="size-5" /> Criar leilão
        </button>
      </div>

      {auctions.length !== 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 w-full h-full">
          {auctions?.map((auction, i) => (
            <AuctionCard
              key={i}
              auction={auction}
              onViewDetails={() => {
                setModalType("details")
                setSelectedAuction(auction)
              }}
            />
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col gap-5 items-center justify-center">
          <p className="text-neutral-500 text-center col-span-full">
            Nenhum leilão ativo no momento, volte mais tarde ou crie o seu
            próprio leilão.
          </p>
          <Frown className="mx-auto size-10 text-neutral-500" />
        </div>
      )}

      {modalType && (
        <AuctionModal
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
          onSubmit={handleCreateAuction}
          type={modalType}
          auction={selectedAuction}
        />
      )}
    </section>
  )
}
