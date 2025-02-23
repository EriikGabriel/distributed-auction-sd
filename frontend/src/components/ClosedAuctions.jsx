import { CopyX } from "lucide-react"
import { useEffect, useState } from "react"
import { getAuctions } from "../api/services"
import { AuctionCard } from "./AuctionCard"
import { AuctionModal } from "./AunctionModal"

export function ClosedAuctions() {
  const [closedAuctions, setClosedAuctions] = useState([])
  const [modalType, setModalType] = useState(null)
  const [selectedAuction, setSelectedAuction] = useState(null)

  useEffect(() => {
    const fetchClosedAuctions = async () => {
      try {
        const response = await getAuctions()

        const closedAuctions = response.data.filter(
          (auction) => auction.active == "false"
        )

        // console.log(closedAuctions)
        setClosedAuctions(closedAuctions)
      } catch (error) {
        console.error("Error fetching active auctions:", error)
      }
    }

    fetchClosedAuctions()
  }, [closedAuctions])

  return (
    <section className="flex flex-col gap-3 min-h-40 bg-neutral-100 border border-neutral-300 rounded-lg p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-700">
          Leilões encerrados - {closedAuctions.length}
        </h1>
      </div>

      {closedAuctions.length !== 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 w-full h-full">
          {closedAuctions.map((auction, i) => (
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
        <div className="w-full bg-rd-500 h-full flex flex-col gap-5 items-center justify-center">
          <p className="text-neutral-500 text-center col-span-full">
            Os leilões encerrados aparecerão aqui, volte mais tarde.
          </p>
          <CopyX className="mx-auto size-10 text-neutral-500" />
        </div>
      )}

      {modalType && (
        <AuctionModal
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
          type={modalType}
          auction={selectedAuction}
        />
      )}
    </section>
  )
}
