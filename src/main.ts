import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

import './assets/main.css'
import autoscrollDirective from './common/directives/autoscroll'
import '@/common/http/mock/base'
// 引入注册脚本
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon.vue'

import {MotionPlugin } from '@vueuse/motion'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(autoscrollDirective)
app.use(Antd)
app.use(MotionPlugin)
app.component('svg-icon', SvgIcon)
app.mount('#app')
