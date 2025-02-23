import {
  BadgeDollarSign,
  HandCoins,
  History,
  Receipt,
  Timer,
  X,
} from "lucide-react"
import { useEffect, useState } from "react"
import { AunctionType } from "../types/aunction"
import { cn } from "../utils/cn"

import PropTypes from "prop-types"
import { placeBid } from "../api/services"

AuctionModalDetails.propTypes = {
  auction: AunctionType,
  onShowHistory: PropTypes.func,
}

export function AuctionModalDetails({ auction, onShowHistory }) {
  const [timeLeft, setTimeLeft] = useState("")
  const [bidValue, setBidValue] = useState("")

  const isClosed = !auction?.active

  useEffect(() => {
    if (!isClosed) {
      const interval = setInterval(() => {
        const now = new Date() // Tempo atual
        const endTime = new Date(auction?.end_time).getTime() // Tempo de término do leilão em milissegundos
        const diff = endTime - now.getTime() // Diferença em milissegundos

        if (diff <= 0) {
          setTimeLeft("Leilão encerrado") // Se o leilão já acabou
          clearInterval(interval) // Limpa o intervalo
        } else {
          const minutes = Math.floor(diff / 60000) // Calcula minutos restantes
          const seconds = Math.floor((diff % 60000) / 1000) // Calcula segundos restantes
          setTimeLeft(`${minutes} min ${seconds} seg`) // Atualiza o estado com o tempo restante
        }
      }, 1000) // Executa a cada segundo

      return () => clearInterval(interval)
    }
  }, [auction, isClosed])

  const handlePlaceBid = async () => {
    const response = await placeBid({
      id: auction.id,
      bid: bidValue,
    })
    console.log(response.data)
  }

  let bids = JSON.parse(auction?.bids ?? "[]")

  return (
    <div className="rounded-lg p-3 flex flex-col gap-2">
      <p className="text-xs italic mb-3">
        {auction?.description || "Descrição do leilão"}
      </p>

      <div className="text-neutral-500 flex justify-between">
        {isClosed ? (
          <div className="flex items-center gap-1">
            <BadgeDollarSign className="size-5" />
            <small>Lance final</small>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <BadgeDollarSign className="size-5" />
            <small>Lance atual</small>
          </div>
        )}
        <span className="text-neutral-900 font-semibold">
          R$ {auction?.current_bid}
        </span>
      </div>

      <div>
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
          <span className="font-semibold">{timeLeft}</span>
        </div>

        <div>
          <small
            className={cn(
              "text-xs text-yellow-700",
              isClosed && "text-red-700"
            )}
          >
            Termin{isClosed ? "ou" : "a"} em:{" "}
            {Intl.DateTimeFormat("pt-BR", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(auction?.end_time))}
          </small>
        </div>
      </div>

      {!isClosed && (
        <div className="text-neutral-500 bg-neutral-100 flex justify-between items-center pl-2 rounded-lg border border-neutral-300 h-10">
          <div className="flex items-center h-full flex-1">
            <BadgeDollarSign className="size-5" />
            <input
              type="text"
              placeholder={`${Number(auction?.current_bid) + 50}`}
              className="p-1 h-full outline-none  w-full"
              onChange={(e) => setBidValue(e.target.value)}
              value={bidValue}
            />
          </div>
          <button
            className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-900/90 text-white transition-all px-3 h-full font-bold rounded-r-lg text-xs"
            onClick={handlePlaceBid}
          >
            <HandCoins className="size-4" /> Dar lance
          </button>
        </div>
      )}

      <div className="flex justify-between items-center text-neutral-500 mt-5">
        <div className="flex items-center gap-1">
          <Receipt className="size-4" />
          <small className="font-semibold">{bids.length} lances</small>
        </div>
        <div className="flex gap-2">
          {!isClosed && (
            <button className="flex items-center gap-1 bg-red-200/70 text-red-500 py-1 px-2 rounded-lg border">
              <X className="size-4" />
            </button>
          )}
          <button
            className="flex items-center gap-1 bg-neutral-200/70 py-1 px-2 rounded-lg border"
            onClick={onShowHistory}
          >
            <History className="size-4" />
            <small className="font-semibold">Histórico de lances</small>
          </button>
        </div>
      </div>
    </div>
  )
}
