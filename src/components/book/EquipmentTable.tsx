import type { EquipTable } from "@/lib/book"

type Props = {
  block: EquipTable
}

type Group = {
  category: string
  items: string[][]
}

/** 원본은 rowspan 대신 빈 셀로 카테고리를 표현했다. 카드 레이아웃을 위해 실제 그룹으로 묶는다. */
function groupByCategory(rows: EquipTable["rows"]): Group[] {
  return rows.reduce<Group[]>((groups, row) => {
    const last = groups.at(-1)
    if (!last || last.category !== row.category) {
      return [...groups, { category: row.category, items: [row.cells] }]
    }
    return [...groups.slice(0, -1), { category: last.category, items: [...last.items, row.cells] }]
  }, [])
}

const GRADE_LABEL: Record<string, string> = {
  "★": "필수",
  "○": "확장 시",
  "△": "프리미엄",
}

function GradeBadge({ grade }: { grade: string }) {
  const label = GRADE_LABEL[grade] ?? grade
  const isEssential = grade === "★"

  return (
    <span
      title={label}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] whitespace-nowrap ${
        isEssential
          ? "bg-[var(--color-dawn-gold)] text-[var(--color-bg-primary)]"
          : "border border-[var(--color-border)] text-[var(--color-text-secondary)]"
      }`}
    >
      {grade} {label}
    </span>
  )
}

export function EquipmentTable({ block }: Props) {
  const groups = groupByCategory(block.rows)

  return (
    <div className="print-avoid-break">
      {/* 모바일: 테이블을 카테고리 카드로 재구성한다. 가로 스크롤 없이 읽힌다. */}
      <div className="space-y-4 md:hidden">
        {groups.map((group) => (
          <section
            key={group.category}
            className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
          >
            <h4 className="border-b border-[var(--color-border)] bg-[var(--color-accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--color-dawn-gold)]">
              {group.category}
            </h4>
            <ul className="divide-y divide-[var(--color-border)]">
              {group.items.map((cells, index) => (
                <li key={index} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm text-[var(--color-text-primary)]">{cells[0]}</span>
                    <GradeBadge grade={cells[2] ?? ""} />
                  </div>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-[var(--color-text-secondary)]">
                    {cells[1]}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* 데스크탑: 원래의 표 형태를 유지하되 넘칠 때만 가로 스크롤한다. */}
      <div className="hidden overflow-x-auto rounded-2xl border border-[var(--color-border)] md:block">
        <table className="w-full min-w-[44rem] border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--color-accent-soft)] text-left">
              {block.headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-4 py-3 font-medium tracking-wider text-[var(--color-dawn-gold)]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, index) => (
              <tr
                key={index}
                className={`border-t border-[var(--color-border)] ${
                  row.isCategoryStart ? "border-t-[var(--color-text-secondary)]/25" : ""
                }`}
              >
                <th
                  scope="row"
                  className="px-4 py-2.5 text-left align-top font-medium whitespace-nowrap text-[var(--color-sage-green)]"
                >
                  {row.isCategoryStart ? row.category : ""}
                </th>
                <td className="px-4 py-2.5 align-top text-[var(--color-text-primary)]">
                  {row.cells[0]}
                </td>
                <td className="px-4 py-2.5 align-top text-[0.8125rem] text-[var(--color-text-secondary)]">
                  {row.cells[1]}
                </td>
                <td className="px-4 py-2.5 align-top">
                  <GradeBadge grade={row.cells[2] ?? ""} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
