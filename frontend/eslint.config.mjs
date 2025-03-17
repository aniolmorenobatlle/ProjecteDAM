// eslint.config.mjs
import { defineConfig } from 'eslint-define-config'

export default defineConfig({
  extends: [
    'airbnb',
    'plugin:prettier/recommended'
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', {
      singleQuote: true,
      semi: false,
      trailingComma: 'all'
    }]
  }
})
