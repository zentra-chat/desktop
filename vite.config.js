import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],

	ssr: {
		noExternal: ['lucide-svelte']
	},
	
	// Tauri-specific config
	clearScreen: false,
	
	server: {
		port: 5173,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
					protocol: 'ws',
					host,
					port: 5174
				}
			: undefined,
		watch: {
			ignored: ['**/src-tauri/**']
		},
		fs: {
			allow: ['..']
		}
	},
	
	envPrefix: ['VITE_', 'TAURI_'],
	
	build: {
		target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
		minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
		sourcemap: !!process.env.TAURI_DEBUG
	}
});
