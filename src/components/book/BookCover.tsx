import { collapseTracking, type Book } from "@/lib/book"

type Props = {
  cover: Book["cover"]
}

export function BookCover({ cover }: Props) {
  const [headline, tagline] = cover.subtitle.split(/<br\s*\/?>/i)

  return (
    <section id="top" className="print-page-break px-4 py-16 text-center sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="mb-6 text-xs tracking-[0.3em] text-[var(--color-dawn-gold)] uppercase">
          {collapseTracking(cover.brand)}
        </p>
        <h1 className="mb-5 font-[family-name:var(--font-serif)] text-3xl leading-tight font-bold text-[var(--color-text-primary)] sm:text-4xl md:text-5xl">
          {cover.title}
        </h1>
        <p className="font-[family-name:var(--font-display)] text-lg text-[var(--color-text-secondary)] italic sm:text-xl">
          {headline}
        </p>
        {tagline && (
          <p className="mt-2 text-sm text-[var(--color-text-secondary)] sm:text-base">{tagline}</p>
        )}

        <dl className="mx-auto mt-10 grid max-w-xl gap-3 text-left sm:grid-cols-2">
          {cover.meta.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3"
            >
              <dt className="text-[0.6875rem] tracking-[0.15em] text-[var(--color-dawn-gold)] uppercase">
                {item.label}
              </dt>
              <dd className="mt-1 text-[0.8125rem] leading-relaxed text-[var(--color-text-primary)]">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
