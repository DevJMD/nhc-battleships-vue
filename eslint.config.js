import {defineConfig} from 'eslint/config';
import js             from '@eslint/js';
import globals        from 'globals';
import tseslint       from 'typescript-eslint';
import pluginVue      from 'eslint-plugin-vue';


export default defineConfig([
    {files: ['**/*.{js,mjs,cjs,ts,vue}'], plugins: {js}, extends: ['js/recommended']},
    {files: ['**/*.{js,mjs,cjs,ts,vue}'], languageOptions: {globals: globals.browser}},
    tseslint.configs.recommended,
    pluginVue.configs['flat/essential'],
    {files: ['**/*.vue'], languageOptions: {parserOptions: {parser: tseslint.parser}}},
    {
        ignores: [
            '**/dist/**',
            '**/node_modules/**',
            '**/coverage/**',
            '**/build/**',
            '.eslintrc.cjs',
            'src/shims-vue.d.ts',
        ],
    },
]);
