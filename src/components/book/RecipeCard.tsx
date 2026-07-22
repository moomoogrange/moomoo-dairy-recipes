import type { Recipe, RecipeBlock } from "@/lib/book"

type Props = {
  recipe: Recipe
}

function BlockContent({ block }: { block: RecipeBlock }) {
  if (block.type === "p") {
    return (
      <p
        className="rich text-[0.9375rem] leading-relaxed text-[var(--color-text-primary)]"
        dangerouslySetInnerHTML={{ __html: block.html }}
      />
    )
  }

  const ListTag = block.type === "ol" ? "ol" : "ul"

  return (
    <ListTag
      className={`rich space-y-2 pl-5 text-[0.9375rem] leading-relaxed text-[var(--color-text-primary)] ${
        block.type === "ol" ? "list-decimal" : "list-disc"
      } marker:text-[var(--color-dawn-gold)]`}
    >
      {block.items.map((item, index) => (
        <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
      ))}
    </ListTag>
  )
}

export function RecipeCard({ recipe }: Props) {
  return (
    <article
      id={recipe.id}
      className="print-avoid-break print-flat scroll-mt-20 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
    >
      <div className="p-5 sm:p-7">
        <header className="mb-5">
          <h3 className="font-[family-name:var(--font-serif)] text-lg font-bold text-[var(--color-text-primary)] sm:text-xl">
            {recipe.title}
          </h3>
          <p className="mt-1 text-xs tracking-[0.2em] text-[var(--color-dawn-gold)] uppercase">
            {recipe.en}
          </p>
        </header>

        {recipe.quick.length > 0 && (
          <dl className="mb-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-4">
            {recipe.quick.map((fact) => (
              <div key={fact.label} className="bg-[var(--color-bg-primary)] px-3 py-3">
                <dt className="text-[0.6875rem] tracking-wider text-[var(--color-dawn-gold)]">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-sm leading-snug text-[var(--color-text-primary)]">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="space-y-5">
          {recipe.sections.map((section, index) => (
            <section key={`${section.heading}-${index}`}>
              {section.heading && (
                <h4 className="mb-2 border-b border-dotted border-[var(--color-border)] pb-1 text-sm font-medium tracking-wider text-[var(--color-sage-green)]">
                  {section.heading}
                </h4>
              )}
              <div className="space-y-3">
                {section.blocks.map((block, blockIndex) => (
                  <BlockContent key={blockIndex} block={block} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {recipe.tip && (
          <div
            className="rich mt-6 rounded-xl border-l-2 border-[var(--color-dawn-gold)] bg-[var(--color-accent-soft)] px-4 py-3 text-sm leading-relaxed text-[var(--color-text-secondary)]"
            dangerouslySetInnerHTML={{ __html: recipe.tip }}
          />
        )}
      </div>
    </article>
  )
}
