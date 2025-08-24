import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import pluginTypeScript from '@typescript-eslint/eslint-plugin';
import parserTypeScript from '@typescript-eslint/parser';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,ts,tsx,vue}'], // Tambahkan dukungan untuk TypeScript
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      parser: parserTypeScript, // Gunakan parser TypeScript
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/vue3-recommended'], // Gunakan konfigurasi Vue 3 yang lebih lengkap
  pluginTypeScript.configs.recommended, // Tambahkan konfigurasi TypeScript
  skipFormatting,

  {
    rules: {
      'no-unused-vars': 'warn',
      'vue/multi-word-component-names': 'off', // Nonaktifkan aturan nama komponen multi-kata
    },
  },
]);