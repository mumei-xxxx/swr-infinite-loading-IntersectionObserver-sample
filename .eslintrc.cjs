module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript',
    'plugin:react-hooks/recommended',
    'prettier',
    '@herp-inc',
    '@herp-inc/eslint-config-react'
  ],
  parser: '@typescript-eslint/parser',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.eslint.json'
  },
  plugins: [
    'react'
  ],
  rules: {
    // '@typescript-eslint/explicit-function-return-type': 'off',
    // 'no-console': 'off',
    'no-console': 'warn',
    'import/no-unassigned-import': ['error', { allow: ['**/*.css'] }]
  }
}
