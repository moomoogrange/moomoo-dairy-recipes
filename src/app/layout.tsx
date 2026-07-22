import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Noto_Sans_KR, Noto_Serif_KR } from "next/font/google"
import { ThemeProvider } from "next-themes"
import "./globals.css"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { book } from "@/lib/book"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: "italic",
  variable: "--font-display",
})
const notoSerif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
})
const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
})

const siteUrl = "https://moomoo-dairy-recipes.vercel.app"
const description =
  "삼수령 무무목장 Jersey A2A2 목초우유 기반 버터·크림·치즈 전 품목 제조 매뉴얼. 31개 레시피와 필수 장비 목록."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "무무목장 A2 목초우유 유가공 레시피북",
    template: "%s | 무무목장 레시피북",
  },
  description,
  openGraph: {
    type: "article",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "무무목장 레시피북",
    title: "무무목장 A2 목초우유 유가공 레시피북",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "무무목장 A2 목초우유 유가공 레시피북",
    description,
  },
  alternates: { canonical: siteUrl },
  robots: { index: true, follow: true },
}

/** 원본 index.html 에 viewport 메타가 없어 모바일이 980px 로 렌더링되던 문제를 여기서 해소한다. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f0e8" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1612" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      className={`${cormorant.variable} ${notoSerif.variable} ${notoSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded focus:bg-[var(--color-dawn-gold)] focus:px-4 focus:py-2 focus:text-white"
          >
            본문으로 건너뛰기
          </a>
          <SiteHeader nav={book.nav} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter text={book.footer} />
        </ThemeProvider>
      </body>
    </html>
  )
}
