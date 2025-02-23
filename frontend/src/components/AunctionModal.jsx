import { X } from "lucide-react"
import PropTypes from "prop-types"
import { useState } from "react"
import { AunctionType } from "../types/aunction"
import { AuctionModalCreateForm } from "./AunctionModalCreateForm"
import { AuctionModalDetails } from "./AunctionModalDetails"

AuctionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  type: PropTypes.oneOf(["create", "details"]).isRequired,
  auction: AunctionType,
}

export function AuctionModal({ isOpen, onClose, onSubmit, type, auction }) {
  const [showHistory, setShowHistory] = useState(false)

  if (!isOpen) return null

  let bids = JSON.parse(auction?.bids ?? "[]")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      {/* Modal principal */}
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg relative transition-all">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
          {type === "create" ? "Criar Leilão" : auction?.title}
        </h2>

        {type === "create" ? (
          <AuctionModalCreateForm onSubmit={onSubmit} onClose={onClose} />
        ) : (
          <AuctionModalDetails
            auction={auction}
            onShowHistory={() => setShowHistory(true)}
          />
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X className="size-6" />
        </button>
      </div>

      {/* Painel de histórico de lances */}
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
            {bids?.map((bid, index) => (
              <li key={index} className="border p-2 rounded bg-gray-100">
                <p className="text-sm font-medium">{bid.user}</p>
                <p className="text-xs text-gray-500">
                  R$ {bid.amount} - {new Date(bid.time).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
