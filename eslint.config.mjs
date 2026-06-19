import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,

	{
		plugins: {
			prettier: eslintPluginPrettier,
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'prettier/prettier': 'warn',
			'simple-import-sort/exports': 'warn',
			'simple-import-sort/imports': [
				'warn',
				{
					groups: [
						// Side effects (ex: import './globals.css')
						['^\\u0000'],

						// Node built-ins (node:)
						['^node:'],

						// Pacotes (react/next primeiro, depois o resto)
						['^react', '^next', '^@?\\w'],

						// Aliases internos (seu tsconfig tem "@/*")
						['^@/'],

						// Relativos (subindo pasta, mesma pasta)
						['^\\.\\.(?!/?$)', '^\\.\\./?$'],
						['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],

						// Estilos no final
						['^.+\\.s?css$'],
					],
				},
			],
		},
	},

	eslintConfigPrettier,

	// Override default ignores of eslint-config-next.
	globalIgnores([
		// Default ignores of eslint-config-next:
		'.next/**',
		'out/**',
		'build/**',
		'next-env.d.ts',
	]),
])

export default eslintConfig
