import {
  BadgeDollarSign,
  HandCoins,
  History,
  Receipt,
  Timer,
  User2,
  X,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Bounce, toast, ToastContainer } from "react-toastify"
import { cn } from "../utils/cn"

import PropTypes from "prop-types"
import { closeAuction, getAuctionDetails, placeBid } from "../api/services"

AuctionModalDetails.propTypes = {
  id: PropTypes.string,
}

export function AuctionModalDetails({ id }) {
  const [auction, setAuction] = useState([])
  const [timeLeft, setTimeLeft] = useState("")
  const [bidValue, setBidValue] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  const [isClosed, setIsClosed] = useState(false)

  useEffect(() => {
    setBidValue(Number(auction?.current_bid ?? 0) + 50)
  }, [auction?.current_bid])

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await getAuctionDetails(id)
        setAuction(response.data)
      } catch (error) {
        console.error("Erro ao buscar detalhes do leilão:", error)
      }
    }

    fetchAuction()
  }, [id, bidValue, isClosed])

  useEffect(() => {
    if (!isClosed) {
      const interval = setInterval(async () => {
        const now = new Date() // Tempo atual
        const endTime = new Date(auction?.end_time).getTime() // Tempo de término do leilão em milissegundos
        const diff = endTime - now.getTime() // Diferença em milissegundos

        if (diff <= 0) {
          const response = await closeAuction(auction.id)

          toast.warn("Leilão encerrado")
          console.log(response.data)

          setIsClosed(true)
          clearInterval(interval)
        } else {
          const minutes = Math.floor(diff / 60000) // Calcula minutos restantes
          const seconds = Math.floor((diff % 60000) / 1000) // Calcula segundos restantes
          setTimeLeft(`${minutes} min ${seconds} seg`) // Atualiza o estado com o tempo restante
        }
      }, 1000) // Executa a cada segundo

      return () => clearInterval(interval)
    }
  }, [auction, isClosed])

  const handlePlaceBid = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const name = formData.get("name")
    const bid = formData.get("bid")

    const response = await placeBid({
      id: auction.id,
      name: name,
      bid: bid,
      datetime: new Date().toISOString(),
    })

    console.log(response.data)

    const auctionsRes = await getAuctionDetails(id)
    setAuction(auctionsRes.data)
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
            }).format(new Date(auction?.end_time ?? new Date()))}
          </small>
        </div>
      </div>

      {!isClosed && (
        <form className="space-y-2" onSubmit={handlePlaceBid}>
          <div className="text-neutral-500 bg-neutral-100 flex justify-between items-center pl-2 rounded-lg border border-neutral-300 h-10">
            <div className="flex items-center h-full flex-1">
              <User2 className="size-5" />
              <input
                type="text"
                placeholder="Nome do usuário"
                className="p-1 h-full outline-none  w-full"
                name="name"
                autoComplete="off"
                required
              />
            </div>
          </div>
          <div className="text-neutral-500 bg-neutral-100 flex justify-between items-center pl-2 rounded-lg border border-neutral-300 h-10">
            <div className="flex items-center h-full flex-1">
              <BadgeDollarSign className="size-5" />
              <input
                type="text"
                placeholder={`${Number(auction?.current_bid) + 50}`}
                className="p-1 h-full outline-none  w-full"
                onChange={(e) => {
                  const placeBidButton =
                    document.getElementById("place-bid-button")
                  placeBidButton.disabled =
                    e.target.value < Number(auction?.current_bid) + 50
                  setBidValue(e.target.value)
                }}
                value={bidValue}
                name="bid"
                required
              />
            </div>
            <button
              id="place-bid-button"
              className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-900/90 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white transition-all px-3 h-full font-bold rounded-r-lg text-xs"
            >
              <HandCoins className="size-4" /> Dar lance
            </button>
          </div>
        </form>
      )}

      <div className="flex justify-between items-center text-neutral-500 mt-5">
        <div className="flex items-center gap-1">
          <Receipt className="size-4" />
          <small className="font-semibold">{bids.length} lances</small>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-1 bg-neutral-200/70 py-1 px-2 rounded-lg border"
            onClick={() => setShowHistory(true)}
          >
            <History className="size-4" />
            <small className="font-semibold">Histórico de lances</small>
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-6 overflow-y-auto transition-transform transform translate-x-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Histórico de lances</h3>
            <button
              onClick={() => setShowHistory(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="size-6" />
            </button>
          </div>
          <ul className="space-y-3 max-h-[80vh] overflow-y-auto">
            {bids?.map((bidData, index) => (
              <li
                key={index}
                className="border p-2 rounded bg-gray-100 border-neutral-500"
              >
                <p className="text-sm font-medium">{bidData.name}</p>
                <p className="text-xs text-gray-500">
                  R$ {bidData.bid} -{" "}
                  {new Date(bidData.datetime).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  )
}
