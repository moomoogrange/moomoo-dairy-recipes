import type { Intro } from "@/lib/book"

type Props = {
  block: Intro
}

export function IntroBlock({ block }: Props) {
  return (
    <section className="print-avoid-break print-flat rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 sm:p-7">
      {block.title && (
        <h3 className="mb-3 font-[family-name:var(--font-serif)] text-base font-bold text-[var(--color-dawn-gold)] sm:text-lg">
          {block.title}
        </h3>
      )}

      <div className="space-y-3">
        {block.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="rich text-[0.9375rem] leading-relaxed text-[var(--color-text-primary)]"
            dangerouslySetInnerHTML={{ __html: paragraph }}
          />
        ))}
      </div>

      {block.profile.length > 0 && (
        <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {block.profile.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border-t-2 border-[var(--color-dawn-gold)] bg-[var(--color-bg-primary)] px-3 py-4 text-center"
            >
              <dt className="sr-only">{item.label}</dt>
              <dd>
                <span className="block font-[family-name:var(--font-serif)] text-2xl font-bold text-[var(--color-dawn-gold)]">
                  {item.value}
                </span>
                <span className="mt-1 block text-[0.6875rem] tracking-[0.15em] text-[var(--color-text-secondary)] uppercase">
                  {item.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}
