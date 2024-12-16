module.exports = {
  env: {
    browser: true,
    es6: true,
    webextensions: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off', // Allow console for extension debugging
    'no-unused-vars': 'warn', // Downgrade to warning
    'no-undef': 'warn', // Downgrade to warning for chrome API
    'no-inner-declarations': 'warn',
    'no-case-declarations': 'warn',
    'no-fallthrough': 'warn',
    'no-empty': 'warn',
    'no-unreachable': 'warn'
  },
  globals: {
    chrome: 'readonly',
    Quill: 'readonly',
    QuillBetterTable: 'readonly',
    QuillTableBetter: 'readonly',
    Data: 'writable',
    $panelSnippets: 'writable',
    $containerSnippets: 'writable',
    $containerFolderPath: 'writable',
    ClipboardItem: 'readonly',
    globalThis: 'readonly'
  }
}
