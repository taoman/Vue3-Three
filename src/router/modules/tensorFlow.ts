import type { RouteRecordRaw } from 'vue-router'
import { RouterEnum } from '../enums'
import AppMain from '@/views/layout/AppMain.vue'
import textDetection from '@/views/tensorFlow/textDetection.vue'
import indexedDb from '@/views/tensorFlow/indexedDb.vue'
import navigation from '@/views/tensorFlow/navigation.vue'
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
        name: 'textDetection',
        component: textDetection,
        meta: {
          title: '文本检测',
          icon: 'form'
        }
      },
      {
        path: '/indexedDb',
        name: 'indexedDb',
        component: indexedDb,
        meta: {
          title: '数据库',
          icon: 'form'
        }
      },
      {
        path: '/navigation',
        name: 'navigation',
        component: navigation,
        meta: {
          title: '导航',
          icon: 'form'
        }
      }
    ]
  }
]
