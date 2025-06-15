import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

console.log('Vite config is loaded')
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // server: {
  //   proxy: {
  //     // 配置代理规则
  //     '/api': {
  //       target: 'http://api.example.com', // 目标服务器地址
  //       changeOrigin: true, // 允许跨域
  //     },
  //   },
  // },
  build: {
    assetsDir: 'static', // 将所有静态资源输出到 dist/static/ 目录
  },
})
// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'

// export default defineConfig({
//   plugins: [vue()],
//   server: {
//     port: 3000, // 示例配置
//   },
// })
