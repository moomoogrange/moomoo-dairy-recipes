import { collapseTracking, type Downloads } from "@/lib/book"

type Props = {
  block: Downloads
}

export function DownloadList({ block }: Props) {
  return (
    <section className="print-avoid-break print-flat rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 sm:p-7">
      <h3 className="mb-4 text-xs tracking-[0.2em] text-[var(--color-brick)] uppercase">
        {collapseTracking(block.title)}
      </h3>
      <ul className="grid gap-2 sm:grid-cols-2">
        {block.items.map((item) => (
          <li key={item.href}>
            <a
              href={`/${item.href}`}
              className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--color-accent-soft)]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="shrink-0 text-[var(--color-sage-green)]"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
              <span className="min-w-0">
                <span className="block text-sm text-[var(--color-text-primary)]">{item.label}</span>
                {item.note && (
                  <span className="block text-xs text-[var(--color-text-secondary)]">
                    {item.note}
                  </span>
                )}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
