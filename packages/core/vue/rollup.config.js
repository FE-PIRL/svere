import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const name = pkg.name
	.replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
	.replace(/^\w/, m => m.toUpperCase())
	.replace(/-\w/g, m => m[1].toUpperCase());
const production = !process.env.ROLLUP_WATCH;

export default {
	input: ['src/index.ts'],
	output: [
		{ file: pkg.module, 'format': 'es', globals: { "vue": "Vue" } },
		{ file: pkg.main, 'format': 'umd', name, globals: { "vue": "Vue" } },
	],
	external: ["vue"],
	plugins: [
		typescript({
			sourceMap: !production,
			types: ["../types"],
			include: [
				'./**/*.ts',
				'../utils/**/*.ts'
			],
			exclude:["src/__tests__/**/*"]
		}),
		commonjs({
			include: /node_modules/
		}),
		resolve({
			browser: true
		}),
		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser({ format: { comments: false } })
	],
};
