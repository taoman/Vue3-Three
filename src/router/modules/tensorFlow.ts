import type { RouteRecordRaw } from 'vue-router'
import {RouterEnum} from '../enums'
import AppMain from '@/views/layout/AppMain.vue'
import textDetection from '@/views/tensorFlow/textDetection.vue'
export const tensorFlow: RouteRecordRaw[] = [
  {
    path: '/tensorFlow',
    name: 'tensorFlow',
    component: AppMain,
    meta: {
      title: '模型',
      icon: 'components',
      rank: RouterEnum.tensorFlow
    },
    children: [
      {
        path: '/textDetection',
        name:'textDetection',
        component: textDetection,
        meta: {
          title: '文本检测',
          icon: 'form'
        }
      }
    ]
  }
]
