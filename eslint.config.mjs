import next from "eslint-config-next"

const eslintConfig = [
  ...next,
  {
    ignores: [".next/**", "node_modules/**", "legacy/**", "public/**"],
  },
]

export default eslintConfig
