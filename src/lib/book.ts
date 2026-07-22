import bookData from "@/data/book.json"

/**
 * scripts/extract-content.mjs 가 legacy/index.html 에서 뽑아낸 구조.
 * 데이터는 빌드 타임에 고정되며 런타임 입력이 섞이지 않는다.
 */
export type QuickFact = {
  label: string
  value: string
}

export type ListBlock = {
  type: "ul" | "ol"
  items: string[]
}

export type ParagraphBlock = {
  type: "p"
  html: string
}

export type RecipeBlock = ListBlock | ParagraphBlock

export type RecipeSection = {
  heading: string
  blocks: RecipeBlock[]
}

export type Recipe = {
  kind: "recipe"
  id: string
  title: string
  en: string
  quick: QuickFact[]
  sections: RecipeSection[]
  tip: string | null
}

export type Intro = {
  kind: "intro"
  title: string
  paragraphs: string[]
  profile: { value: string; label: string }[]
}

export type EquipTable = {
  kind: "equipTable"
  headers: string[]
  rows: { category: string; isCategoryStart: boolean; cells: string[] }[]
}

export type PhotoGrid = {
  kind: "photoGrid"
  wide: boolean
  photos: {
    src: string
    alt: string
    plate: string
    caption: string
    source: string
  }[]
}

export type Downloads = {
  kind: "downloads"
  title: string
  items: { href: string; label: string; note: string }[]
}

export type ContentBlock = Recipe | Intro | EquipTable | PhotoGrid | Downloads

export type Chapter = {
  id: string
  number: string
  title: string
  description: string
  blocks: ContentBlock[]
}

export type NavItem = {
  href: string
  number: string
  label: string
}

export type Book = {
  cover: {
    brand: string
    title: string
    subtitle: string
    meta: { label: string; value: string }[]
  }
  nav: NavItem[]
  overview: Intro
  chapters: Chapter[]
  footer: string
}

export const book = bookData as Book

/**
 * "M O O M O O &nbsp; R A N C H" 처럼 자간을 공백으로 흉내 낸 문자열을 일반 텍스트로 되돌린다.
 * 원본에서 단어 경계는 nbsp 로만 표현됐으므로 그것을 기준으로 나눈다.
 */
export function collapseTracking(value: string): string {
  return value
    .split(/\u00a0+/)
    .map((word) => word.replace(/\s+/g, ""))
    .filter(Boolean)
    .join(" ")
}

/** 챕터별 레시피 목차. 목차 UI 와 챕터 내부 앵커가 같은 소스를 쓰도록 한다. */
export function getChapterRecipes(chapter: Chapter): Recipe[] {
  return chapter.blocks.filter((block): block is Recipe => block.kind === "recipe")
}
