import { collapseTracking, type PhotoGrid as PhotoGridBlock } from "@/lib/book"

type Props = {
  block: PhotoGridBlock
}

export function PhotoGrid({ block }: Props) {
  return (
    <div
      className={`grid gap-5 ${block.wide ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
    >
      {block.photos.map((photo) => (
        <figure
          key={photo.src}
          className="print-avoid-break print-flat overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
        >
          {/* 원본 이미지 비율이 제각각이라 고정 비율 대신 자연 비율을 유지한다. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/${photo.src}`}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className="block w-full bg-[var(--color-accent-soft)]"
          />
          <figcaption className="px-4 py-4">
            {photo.plate && (
              <span className="mb-1.5 block text-[0.6875rem] tracking-[0.2em] text-[var(--color-dawn-gold)] uppercase">
                {collapseTracking(photo.plate)}
              </span>
            )}
            <p className="text-[0.875rem] leading-relaxed text-[var(--color-text-primary)]">
              {photo.caption}
            </p>
            {photo.source && (
              <p className="mt-2 text-[0.75rem] text-[var(--color-text-secondary)] italic">
                {photo.source}
              </p>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
