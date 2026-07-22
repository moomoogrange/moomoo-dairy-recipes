# 무무목장 A2 목초우유 유가공 레시피북

무무목장(MooMoo Ranch)의 A2 목초우유로 만드는 유제품 레시피 모음.

Live: https://moomoo-dairy-recipes.vercel.app

## 스택

MooMoo Tech Blog와 동일한 스택·디자인 언어를 쓴다.

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4
- next-themes (라이트 / 다크 / 시스템)

## 개발

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## 콘텐츠 구조

레시피 본문은 컴포넌트에 하드코딩하지 않는다. 원본 단일 HTML(`legacy/index.html`)을
파서로 읽어 `src/data/book.json`으로 추출하고, 컴포넌트는 그 JSON만 렌더링한다.

```bash
npm run extract   # legacy/index.html → src/data/book.json
```

| 경로 | 역할 |
|------|------|
| `legacy/index.html` | 마이그레이션 이전 원본. 콘텐츠의 단일 출처 |
| `scripts/extract-content.mjs` | HTML → JSON 파서 |
| `src/data/book.json` | 추출된 레시피북 데이터 (챕터 11 · 레시피 31) |
| `src/lib/book.ts` | 데이터 타입 정의 |
| `src/components/book/` | 레시피 · 장비표 · 사진 · 다운로드 렌더러 |
| `public/images`, `public/refs` | 공정 사진, 원본 PDF |

본문을 고칠 때는 `legacy/index.html`을 수정한 뒤 `npm run extract`를 다시 돌린다.

## 인쇄

원본의 A4 레시피북 인쇄 기능을 유지한다. 헤더 등 UI는 `no-print`로 숨기고,
다크 모드여도 인쇄물은 라이트로 강제하며, 레시피 카드는 페이지 중간에서 잘리지 않는다.
