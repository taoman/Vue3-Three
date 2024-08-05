import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import App from './App.vue'
import { router } from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import './assets/main.css'
import autoscrollDirective from './common/directives/autoscroll'
import '@/common/http/mock/base'
// 引入注册脚本
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon.vue'

import { MotionPlugin } from '@vueuse/motion'
import formCreate from '@form-create/element-ui'
import FcDesigner from '@form-create/designer'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const pinia = createPinia()
const app = createApp(App)
pinia.use(piniaPersist)
app.use(pinia)
app.use(autoscrollDirective)
app.use(ElementPlus)
app.use(Antd)
app.use(MotionPlugin)
app.component('svg-icon', SvgIcon)
app.use(formCreate)
app.use(FcDesigner)
app.use(router)

app.mount('#app')
