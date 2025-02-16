import {
  BadgeDollarSign,
  HandCoins,
  History,
  Receipt,
  Timer,
  X,
} from "lucide-react"
import { cn } from "../utils/cn"

import PropTypes from "prop-types"

AuctionCard.propTypes = {
  isClosed: PropTypes.bool.isRequired,
}

export function AuctionCard({ isClosed }) {
  return (
    <div className="bg-neutral-50 shadow-lg border border-neutral-200 rounded-lg p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Auction Name</h1>

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
        <span className="text-neutral-900 font-semibold">R$ 5.000</span>
      </div>

      <div
        className={cn(
          "text-yellow-700 bg-amber-100 border border-yellow-500 flex justify-between items-center p-2 rounded-lg",
          isClosed && "text-red-700 bg-red-100 border-red-500 "
        )}
      >
        <div className="flex gap-2">
          <Timer className="size-5" />
          {!isClosed ? (
            <span className="font-semibold">Leilão em andamento</span>
          ) : (
            <span className="font-semibold">Leilão encerrado</span>
          )}
        </div>
        <span className="font-semibold">30 seg.</span>
      </div>

      {!isClosed && (
        <div className="text-neutral-500 bg-neutral-100 flex justify-between items-center pl-2 rounded-lg border border-neutral-300 h-10">
          <div className="flex items-center h-full flex-1">
            <BadgeDollarSign className="size-5" />
            <input
              type="text"
              placeholder="5.050"
              className="p-1 h-full outline-none  w-full"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-900/90 text-white transition-all px-3 h-full font-bold rounded-r-lg text-xs">
            <HandCoins className="size-4" /> Dar lance
          </button>
        </div>
      )}

      <div className="flex justify-between items-center text-neutral-500 mt-5">
        <div className="flex items-center gap-1">
          <Receipt className="size-4" />
          <small className="font-semibold">6 lances</small>
        </div>
        <div className="flex gap-2">
          {!isClosed && (
            <button className="flex items-center gap-1 bg-red-200/70 text-red-500 py-1 px-2 rounded-lg border">
              <X className="size-4" />
            </button>
          )}
          <button className="flex items-center gap-1 bg-neutral-200/70 py-1 px-2 rounded-lg border">
            <History className="size-4" />
            <small className="font-semibold">Histórico de lances</small>
          </button>
        </div>
      </div>
    </div>
  )
}
