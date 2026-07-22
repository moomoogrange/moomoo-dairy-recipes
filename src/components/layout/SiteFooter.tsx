import { collapseTracking } from "@/lib/book"

type Props = {
  text: string
}

export function SiteFooter({ text }: Props) {
  return (
    <footer className="border-t border-[var(--color-border)] px-4 py-10 text-center sm:px-6">
      <p className="text-xs tracking-[0.2em] text-[var(--color-text-secondary)] uppercase">
        {collapseTracking(text)}
      </p>
    </footer>
  )
}
