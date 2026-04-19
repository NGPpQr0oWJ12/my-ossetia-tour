import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv, searchForWorkspaceRoot } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/',
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
      force: true
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL || "http://localhost:8787",
          changeOrigin: true,
        },
      },
      fs: {
        strict: false,
        allow: [
          searchForWorkspaceRoot(process.cwd()),
          '..',
        ],
        // Исключаем .git из списка запрещенных, так как проект находится внутри такой папки.
        // Оставляем только базовые запреты для безопасности.
        deny: ['.env', '.env.*', '*.{crt,pem}'],
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
// Trigger Vite restart to clear 504 Outdated Optimize Dep error
