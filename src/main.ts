import './assets/main.css'
import '@/assets/css/reset.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import VueWatermark from 'vue-watermark-directive'

// 仅在开发环境引入Mock
if (process.env.NODE_ENV === 'development') {
  import('./mock').then(() => {
    console.log('Mock data initialized')
  })
}

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.use(VueWatermark)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
