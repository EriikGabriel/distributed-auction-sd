import { Search } from "lucide-react"

export function Header() {
  return (
    <header className="flex items-center gap-12 w-full min-h-12 py-3">
      <div className="flex items-center gap-12 w-full">
        <h1 className="text-2xl font-bold text-neutral-700">Leilão Online</h1>
        <div className="flex items-center bg-neutral-50 text-neutral-500 border border-neutral-300 rounded-lg px-2 w-3/5">
          <Search className="size-5 text-neutral-400 " />
          <input
            type="search"
            className="p-3 outline-none font-semibold w-full"
            placeholder="Buscar leilão..."
          />
        </div>
      </div>

      <img
        src="https://api.dicebear.com/9.x/thumbs/svg?seed=Destiny&backgroundColor=262626"
        alt="Avatar"
        className="rounded-lg size-12"
      />
    </header>
  )
}
