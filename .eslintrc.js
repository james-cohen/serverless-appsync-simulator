module.exports = {
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    project: true,
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['dist/**', '.eslintrc.js'],
  root: true,
  rules: {
    'import/extensions': [
      'error',
      'never',
      {
        json: 'always',
      },
    ],
    'import/no-unresolved': 'off',
    'max-len': ['warn', 150],
    'prettier/prettier': 'warn',
    curly: ['error', 'all'],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: false,
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.test.ts'],
      env: {
        jest: true,
      },
    },
  ],
};
