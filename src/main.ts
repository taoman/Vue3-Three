import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

import './assets/main.css'
import autoscrollDirective from './common/directives/autoscroll'
import '@/common/http/mock'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(autoscrollDirective)
app.use(Antd)

app.mount('#app')
