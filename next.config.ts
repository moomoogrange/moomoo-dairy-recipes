import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // 상위 디렉토리의 lockfile 을 워크스페이스 루트로 오인하지 않게 고정한다.
  turbopack: {
    root: __dirname,
  },
  outputFileTracingExcludes: {
    "*": ["./legacy/**"],
  },
}

export default nextConfig
