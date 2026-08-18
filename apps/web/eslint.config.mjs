import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';
import reactCompiler from 'eslint-plugin-react-compiler';

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  prettierConfig,
  {
    plugins: { 'react-compiler': reactCompiler },
    rules: { 'react-compiler/react-compiler': 'error' },
  },
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
];

export default eslintConfig;
