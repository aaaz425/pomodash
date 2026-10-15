// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const reactCompiler = require('eslint-plugin-react-compiler');

module.exports = defineConfig([
  expoConfig,
  {
    plugins: { 'react-compiler': reactCompiler },
    rules: { 'react-compiler/react-compiler': 'error' },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/components/shared/Text.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-native',
              importNames: ['Text'],
              message: "글자 크기 상한이 적용된 '@/components/shared/Text'를 사용하세요.",
            },
          ],
        },
      ],
    },
  },
  {
    ignores: ['dist/*'],
  },
]);
