const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 'latest'
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['src/*', 'src/**'],
              message: 'No usar imports legacy absolutos `src/...`. Usa rutas relativas por capa.'
            },
            {
              group: ['@/*', '@/**'],
              message: 'No usar aliases globales. Usa rutas relativas por capa.'
            }
          ]
        }
      ]
    }
  }
];
