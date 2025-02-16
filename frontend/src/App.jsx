import { ActiveAuctions } from "./components/ActiveAuctions"
import { ClosedAuctions } from "./components/ClosedAuctions"
import { Header } from "./components/Header"

export function App() {
  return (
    <main className="bg-neutral-200 h-dvh w-dvw px-8 flex flex-col gap-5">
      <Header />

      <ActiveAuctions />

      <ClosedAuctions />
    </main>
  )
}
