import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'node:path';
import { defineConfig } from 'vite';

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;
const pluginSdkPath = process.env.ZENTRA_PLUGIN_SDK_PATH?.trim();
const useLocalPluginSdk = Boolean(pluginSdkPath) && process.env.NODE_ENV !== 'production';
const localPluginSdkRoot = useLocalPluginSdk ? path.resolve(process.cwd(), pluginSdkPath) : '';

const pluginSdkAlias = useLocalPluginSdk
	? {
			'@zentra/plugin-sdk/runtime': path.join(localPluginSdkRoot, 'src/runtime.ts'),
			'@zentra/plugin-sdk': path.join(localPluginSdkRoot, 'src'),
			'@zentra-chat/plugin-sdk/runtime': path.join(localPluginSdkRoot, 'src/runtime.ts'),
			'@zentra-chat/plugin-sdk': path.join(localPluginSdkRoot, 'src')
		}
	: {
			'@zentra/plugin-sdk/runtime': '@zentra-chat/plugin-sdk/runtime',
			'@zentra/plugin-sdk': '@zentra-chat/plugin-sdk'
		};

const fsAllow = useLocalPluginSdk ? ['.', '..', localPluginSdkRoot] : ['.', '..'];

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],

	optimizeDeps: {
		include: ['@emoji-mart/data', 'markdown-it']
	},

	resolve: {
		alias: {
			'@zentra/default-plugin': new URL('./frontend/default-plugin/src', import.meta.url).pathname,
			...pluginSdkAlias
		}
	},

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
			allow: fsAllow
		}
	},
	
	envPrefix: ['VITE_', 'TAURI_'],
	
	build: {
		target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
		minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
		sourcemap: !!process.env.TAURI_DEBUG
	}
});
