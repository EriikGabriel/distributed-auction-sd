import PropTypes from "prop-types"

AuctionModalCreateForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export function AuctionModalCreateForm({ onSubmit, onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault()

    const data = {
      id: crypto.randomUUID(),
      title: e.target.title.value,
      description: e.target.description.value,
      starting_price: e.target.starting_price.value,
      current_bid: e.target.starting_price.value,
      end_time: e.target.end_time.value,
      bids: [],
      active: "True",
    }

    onSubmit(data)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          type="text"
          name="title"
          required
          className="w-full rounded border border-gray-300 px-3 py-2 focus:border-neutral-800 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          name="description"
          required
          className="w-full rounded border border-gray-300 px-3 py-2 focus:border-neutral-800 focus:outline-none"
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preço Inicial
        </label>
        <input
          type="number"
          name="starting_price"
          required
          className="w-full rounded border border-gray-300 px-3 py-2 focus:border-neutral-800 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data/Hora de Término
        </label>
        <input
          type="datetime-local"
          name="end_time"
          required
          className="w-full rounded border border-gray-300 px-3 py-2 focus:border-neutral-800 focus:outline-none"
        />
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Criar
        </button>
      </div>
    </form>
  )
}
