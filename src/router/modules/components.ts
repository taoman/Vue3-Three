import type { RouteRecordRaw } from 'vue-router'
import {RouterEnum} from '../enums'
import AppMain from '@/views/layout/AppMain.vue'
import FormTemplate from '@/views/components/FormTemplate.vue'
import TableTemplate from '@/views/components/TableTemplate.vue'
export const componentsCenter: RouteRecordRaw[] = [
  {
    path: '/components',
    name: 'components',
    component: AppMain,
    meta: {
      title: '组件中心',
      rank: RouterEnum.components
    },
    children: [
      {
        path: '/components/form',
        name:'componentsForm',
        component: FormTemplate,
        meta: {
          title: '表单组件'
        }
      },
      {
        path: '/components/table',
        name:'componentsTable',
        component: TableTemplate,
        meta: {
          title: '表格组件'
        }
      }
    ]
  }
]
