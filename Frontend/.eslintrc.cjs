module.exports = {
  root: true,
  ignorePatterns: ['dist/**', 'node_modules/**'],
  overrides: [
    {
      files: ['src/**/*.ts'],
      parser: '@typescript-eslint/parser',
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
  ]
};
