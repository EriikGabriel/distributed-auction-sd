import { X } from "lucide-react"
import PropTypes from "prop-types"
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
  if (!isOpen) return null

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
          <AuctionModalDetails id={auction.id} />
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X className="size-6" />
        </button>
      </div>
    </div>
  )
}
