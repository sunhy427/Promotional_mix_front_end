import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// import { cspHtmlPlugin } from 'vite-plugin-csp'

console.log('Vite config is loaded')
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  html: {
    cspNonce: 'NONCE_PLACE_HOLDER',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 13002,
    proxy: {
      // 配置代理规则
      '/multichannel': {
        target:'http://shauaimlapp01vp:14444',
        //target: 'http://shauapp003p.rxcorp.com:14444', // 目标服务器地址
        changeOrigin: true, // 允许跨域
      },
      '/as': {
        target: 'http://shauapp003p.rxcorp.com:14444', // 目标服务器地址
        changeOrigin: true, // 允许跨域
      },
    },
  },
  build: {
    assetsDir: 'static', // 将所有静态资源输出到 dist/static/ 目录
  },
})
