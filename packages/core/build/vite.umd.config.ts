import {defineConfig} from 'vite'
import {readFileSync, readFile} from 'fs'
import {resolve} from 'path'
import {defer, delay} from 'lodash-es'
import {visualizer} from 'rollup-plugin-visualizer'
import {compression} from 'vite-plugin-compression2'

import shell from 'shelljs'
import vue from '@vitejs/plugin-vue'
import hooks from './hooksPlugin.ts'
import terser from '@rollup/plugin-terser'

const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'

function moveStyles() {
	readFile('./dist/umd/index.css.gz', (err) => {
		if (err) return delay(moveStyles, 800)
		defer(() => shell.cp('./dist/umd/index.css', './dist/index.css'))
	})
}

export default defineConfig({
	plugins: [
		vue(),
		compression({
			include: /.(cjs|css)$/i
		}),
		visualizer({
			filename: 'dist/stats.umd.html'
		}),
		terser({
			compress: {
				drop_console: ['log'],
				drop_debugger: true,
				passes: 3,
				global_defs: {
					'@DEV': JSON.stringify(isDev),
					'@PROD': JSON.stringify(isProd),
					'@TEST': JSON.stringify(isTest),
				}
			},
		}),
		hooks({
			rmFiles: ['./dist/umd', './dist/index.css'],
			afterBuild: moveStyles,
		})
	],
	build: {
		outDir: 'dist/umd',
		lib: {
			entry: resolve(__dirname, '../index.ts'),
			name: 'itzhi-ui',
			fileName: 'index',
			formats: ['umd'],
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				exports: 'named',
				globals: {
					vue: 'Vue'
				},
				assetFileNames: (assetInfo) => {
					if (assetInfo.name === 'style.css') return 'index.css'
					return assetInfo.name as string
				}
			}
		}
	}
})
