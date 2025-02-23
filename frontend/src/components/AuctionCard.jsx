import { BadgeDollarSign, BookOpenText } from "lucide-react"
import PropTypes from "prop-types"
import { cn } from "../utils/cn"

AuctionCard.propTypes = {
  auction: PropTypes.object.isRequired,
  onViewDetails: PropTypes.func.isRequired,
}

export function AuctionCard({ auction, onViewDetails }) {
  const isClosed = auction?.active === "false"

  return (
    <div className="bg-neutral-50 shadow-lg border border-neutral-200 rounded-lg p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">{auction?.title}</h1>

        <div
          className={cn(
            "bg-yellow-500 border border-yellow-600 p-1.5 rounded-full",
            isClosed && "bg-red-500 border-red-600"
          )}
        />
      </div>

      <div className="text-neutral-500 flex justify-between">
        {isClosed ? (
          <div className="flex items-center gap-1">
            <BadgeDollarSign className="size-5" />
            <small>Valor final</small>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <BadgeDollarSign className="size-5" />
            <small>Valor atual</small>
          </div>
        )}
        <span className="text-neutral-900 font-semibold">
          R$ {auction?.current_bid}
        </span>
      </div>

      <button
        onClick={onViewDetails}
        className={cn(
          "bg-neutral-900 hover:bg-neutral-900/90 text-white transition-all px-8 flex items-center justify-center gap-3 py-2 rounded font-bold",
          isClosed && "bg-neutral-700 hover:bg-neutral-500/90"
        )}
      >
        <BookOpenText className="size-5" /> Ver detalhes
      </button>
    </div>
  )
}
