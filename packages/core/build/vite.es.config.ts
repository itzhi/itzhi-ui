import {defineConfig} from 'vite'
import {readdirSync, readdir} from 'fs'
import {resolve} from 'path'
import {defer, delay, filter, map} from 'lodash-es'
import {visualizer} from 'rollup-plugin-visualizer'
import shell from 'shelljs'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import hooks from './hooksPlugin.ts'
import terser from '@rollup/plugin-terser'

const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'

function getDirectoriesSync(basePath: string) {
	const entries = readdirSync(basePath, {withFileTypes: true})
	return map(filter(entries, (entry) => entry.isDirectory()), (entry) => entry.name)
}

function moveStyles() {
	readdir('./dist/es/theme', (err) => {
		if (err) return delay(moveStyles, 800)
		defer(() => shell.mv('./dist/es/theme', './dist'))
	})
}

export default defineConfig({
	plugins: [
		vue(),
		visualizer({
			filename: 'dist/stats.es.html'
		}),
		dts({
			tsconfigPath: '../../tsconfig.build.json',
			outDir: 'dist/types'
		}),
		terser({
			compress: {
				sequences: isProd,
				arguments: isProd,
				drop_console: isProd && ['log'],
				drop_debugger: isProd,
				passes: isProd ? 4 : 1,
				global_defs: {
					'@DEV': JSON.stringify(isDev),
					'@PROD': JSON.stringify(isProd),
					'@TEST': JSON.stringify(isTest),
				}
			},
			format: {
				semicolons: false,
				shorthand: isProd,
				braces: !isProd,
				beautify: !isProd,
				comments: !isProd,
			},
			mangle: {
				toplevel: isProd,
				eval: isProd,
				keep_classnames: isDev,
				keep_fnames: isDev
			}
		}),
		hooks({
			rmFiles: ['./dist/es', './dist/theme', './dist/types'],
			afterBuild: moveStyles,
		})
	],
	build: {
		outDir: 'dist/es',
		minify: false,
		cssCodeSplit: true,
		lib: {
			entry: resolve(__dirname, '../index.ts'),
			name: 'itzhi-ui',
			fileName: 'index',
			formats: ['es'],
		},
		rollupOptions: {
			external: [
				'vue',
				'@fortawesome/fontawesome-svg-core',
				'@fortawesome/free-solid-svg-icons',
				'@fortawesome/vue-fontawesome',
				'@popperjs/core',
				'async-validator'
			],
			output: {
				assetFileNames: (assetInfo) => {
					if (assetInfo.name === 'style.css') return 'index.css'
					if (assetInfo.type === 'asset' && /\.(css)$/i.test(assetInfo.name as string)) {
						return 'theme/[name].[ext]'
					}
					return assetInfo.name as string
				},
				manualChunks(id) {
					if (id.includes('node_modules')) {
						return 'vendor'
					}
					if (id.includes('/packages/hooks')) {
						return 'hooks'
					}
					if (id.includes('/packages/utils') || id.includes('plugin-vue:export-helper')) {
						return 'utils'
					}

					for (const dirName of getDirectoriesSync("../components")) {
						if (id.includes(`/packages/components/${dirName}`)) {
							return dirName
						}
					}
				}
			}
		}
	}
})
