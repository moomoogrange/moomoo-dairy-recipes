/**
 * legacy/index.html 을 구조화 JSON 으로 추출한다.
 * 원본 마크업을 손으로 옮기지 않고 파싱해 콘텐츠 손실을 0 으로 만드는 것이 목적이다.
 *
 * 출력: src/data/book.json
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as cheerio from 'cheerio'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = resolve(ROOT, 'legacy/index.html')
const OUTPUT = resolve(ROOT, 'src/data/book.json')

const ALLOWED_INLINE_TAGS = new Set(['b', 'i', 'br', 'span'])
const ALLOWED_SPAN_CLASSES = new Set(['spec', 'badge'])

/**
 * 인라인 HTML 을 화이트리스트 기반으로 정리한다.
 * 렌더링 시 dangerouslySetInnerHTML 을 쓰므로 허용 태그 외에는 모두 제거한다.
 */
function sanitizeInline($, element) {
  const $el = $(element).clone()

  $el.find('*').each((_, node) => {
    const $node = $(node)
    const tag = node.tagName?.toLowerCase()

    if (!ALLOWED_INLINE_TAGS.has(tag)) {
      $node.replaceWith($node.html() ?? '')
      return
    }

    const className = $node.attr('class')
    for (const attr of Object.keys(node.attribs ?? {})) {
      $node.removeAttr(attr)
    }
    if (tag === 'span' && className && ALLOWED_SPAN_CLASSES.has(className)) {
      $node.attr('class', className)
    }
  })

  return $el.html()?.trim() ?? ''
}

/**
 * 공백을 정리하되 &nbsp; 는 남긴다.
 * 원본은 "M O O M O O &nbsp; R A N C H" 처럼 자간은 일반 공백, 단어 경계는 &nbsp; 로 표현했다.
 * 둘을 함께 뭉개면 단어 경계가 사라지므로 nbsp 만 보존한다.
 */
function text($, element) {
  return $(element)
    .text()
    .replace(/[^\S\u00a0]+/g, " ")
    .trim()
}

/** "C H A P T E R   1" 처럼 자간이 벌어진 원본 문자열에서 숫자만 뽑는다. */
function chapterNumber(raw) {
  return raw.replace(/[^0-9]/g, '')
}

function parseQuickFacts($, $recipe) {
  return $recipe
    .find('.quick > div')
    .map((_, cell) => {
      const $cell = $(cell)
      const label = text($, $cell.find('b'))
      const $value = $cell.clone()
      $value.find('b').remove()
      return { label, value: text($, $value) }
    })
    .get()
}

/** h4 를 기준으로 재료/공정 등 소제목 블록을 나눈다. h4 없이 시작하는 목록도 보존한다. */
function parseRecipeSections($, $recipe) {
  const sections = []
  let current = { heading: '', blocks: [] }

  $recipe.children().each((_, node) => {
    const $node = $(node)
    const tag = node.tagName?.toLowerCase()

    if (tag === 'h4') {
      if (current.heading || current.blocks.length > 0) sections.push(current)
      current = { heading: text($, $node), blocks: [] }
      return
    }

    if (tag === 'ul' || tag === 'ol') {
      const items = $node
        .children('li')
        .map((_, li) => sanitizeInline($, li))
        .get()
      current.blocks.push({ type: tag, items })
      return
    }

    if (tag === 'p') {
      current.blocks.push({ type: 'p', html: sanitizeInline($, $node) })
    }
  })

  if (current.heading || current.blocks.length > 0) sections.push(current)
  return sections
}

function parseRecipe($, node, order) {
  const $recipe = $(node)
  const title = text($, $recipe.children('h3'))

  return {
    kind: 'recipe',
    id: `recipe-${order}`,
    title,
    en: text($, $recipe.children('.en')),
    quick: parseQuickFacts($, $recipe),
    sections: parseRecipeSections($, $recipe),
    tip: $recipe.children('.tip').length > 0 ? sanitizeInline($, $recipe.children('.tip')) : null,
  }
}

function parseIntro($, node) {
  const $intro = $(node)
  return {
    kind: 'intro',
    title: text($, $intro.children('h3')),
    paragraphs: $intro
      .children('p')
      .map((_, p) => sanitizeInline($, p))
      .get(),
    profile: $intro
      .find('.profile .card')
      .map((_, card) => ({
        value: text($, $(card).find('.num')),
        label: text($, $(card).find('.lbl')),
      }))
      .get(),
  }
}

function parseEquipTable($, node) {
  const $table = $(node)
  const headers = $table
    .find('thead th')
    .map((_, th) => text($, th))
    .get()

  let lastCategory = ''
  const rows = $table
    .find('tbody tr')
    .map((_, tr) => {
      const cells = $(tr)
        .find('td')
        .map((_, td) => text($, td))
        .get()
      // 원본은 같은 카테고리의 2번째 행부터 셀을 비워 rowspan 효과를 냈다.
      // 모바일 카드 레이아웃에서는 각 행이 독립적이라 카테고리를 채워 넣는다.
      const [category, ...rest] = cells
      if (category) lastCategory = category
      return { category: category || lastCategory, isCategoryStart: Boolean(category), cells: rest }
    })
    .get()

  return { kind: 'equipTable', headers, rows }
}

function parsePhotoGrid($, node) {
  const $grid = $(node)
  return {
    kind: 'photoGrid',
    wide: $grid.hasClass('wide'),
    photos: $grid
      .find('.photo')
      .map((_, photo) => {
        const $photo = $(photo)
        const $cap = $photo.find('.cap').clone()
        const plate = text($, $cap.find('b'))
        const source = text($, $cap.find('.src'))
        $cap.find('b, .src').remove()
        return {
          src: $photo.find('img').attr('src') ?? '',
          alt: $photo.find('img').attr('alt') ?? '',
          plate,
          caption: text($, $cap),
          source,
        }
      })
      .get(),
  }
}

function parseDownloads($, node) {
  const $downloads = $(node)
  return {
    kind: 'downloads',
    title: text($, $downloads.children('h4')),
    items: $downloads
      .find('li')
      .map((_, li) => {
        const $li = $(li)
        const $link = $li.find('a')
        const $note = $li.clone()
        $note.find('a').remove()
        return {
          href: $link.attr('href') ?? '',
          label: text($, $link),
          note: text($, $note).replace(/^[📄\s—-]+/, ''),
        }
      })
      .get(),
  }
}

/** 챕터 헤더를 만날 때마다 새 챕터를 열고, 이후 형제 노드를 그 챕터에 귀속시킨다. */
function parseChapters($) {
  const chapters = []
  let current = null
  let recipeOrder = 0

  $('.page').children().each((_, node) => {
    const $node = $(node)

    if ($node.hasClass('chapter')) {
      current = {
        id: $node.attr('id'),
        number: chapterNumber(text($, $node.children('.num'))),
        title: text($, $node.children('h2')),
        description: text($, $node.children('p')),
        blocks: [],
      }
      chapters.push(current)
      return
    }

    if (!current) return

    if ($node.hasClass('recipe')) {
      recipeOrder += 1
      current.blocks.push(parseRecipe($, node, recipeOrder))
    } else if ($node.hasClass('intro')) {
      current.blocks.push(parseIntro($, node))
    } else if ($node.hasClass('equip')) {
      current.blocks.push(parseEquipTable($, node))
    } else if ($node.hasClass('photo-grid')) {
      current.blocks.push(parsePhotoGrid($, node))
    } else if ($node.hasClass('downloads')) {
      current.blocks.push(parseDownloads($, node))
    }
  })

  return chapters
}

function parseCover($) {
  const $cover = $('.cover')
  return {
    brand: text($, $cover.children('.brand')),
    title: text($, $cover.children('h1')),
    subtitle: sanitizeInline($, $cover.children('.sub')),
    meta: $cover
      .children('.meta')
      .html()
      ?.split(/<br\s*\/?>/i)
      .map((line) => cheerio.load(`<div>${line}</div>`)('div').text().replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .map((line) => {
        const [label, ...rest] = line.split('·')
        return { label: label.trim(), value: rest.join('·').trim() }
      }) ?? [],
  }
}

function parseNav($) {
  return $('.chips a')
    .map((_, a) => {
      const $a = $(a)
      const $label = $a.clone()
      $label.find('.n').remove()
      return {
        href: $a.attr('href') ?? '',
        number: text($, $a.find('.n')),
        label: text($, $label),
      }
    })
    .get()
}

function main() {
  const html = readFileSync(SOURCE, 'utf-8')
  const $ = cheerio.load(html)

  const book = {
    cover: parseCover($),
    nav: parseNav($),
    // 표지 바로 아래 A2 특성 소개 블록은 챕터에 속하지 않아 별도로 뽑는다.
    overview: parseIntro($, $('.page > .intro').first()),
    chapters: parseChapters($),
    footer: text($, $('.foot')),
  }

  const recipeCount = book.chapters.reduce(
    (sum, chapter) => sum + chapter.blocks.filter((block) => block.kind === 'recipe').length,
    0,
  )

  mkdirSync(dirname(OUTPUT), { recursive: true })
  writeFileSync(OUTPUT, `${JSON.stringify(book, null, 2)}\n`, 'utf-8')

  console.log(
    `추출 완료 — 챕터 ${book.chapters.length} · 레시피 ${recipeCount} · 네비 ${book.nav.length}`,
  )
}

main()
