import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    base: './', // Use './' for static hosting, or '/' if deploying at domain root
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    // No proxy, no https, no backend config for static build
});
