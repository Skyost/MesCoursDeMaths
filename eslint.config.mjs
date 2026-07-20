import withNuxt from './.nuxt/eslint.config.mjs'
import typescriptParser from '@typescript-eslint/parser'

export default withNuxt({
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/multi-word-component-names': 'off',
    'import/first': 'off',
    'vue/no-v-html': 'off'
  }
}).append({
  files: ['modules/**/*.ts'],
  languageOptions: {
    parser: typescriptParser
  }
}).override('nuxt/stylistic', {
  rules: {
    '@stylistic/comma-dangle': ['error', 'never']
  }
})
