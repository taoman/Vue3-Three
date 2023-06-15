import type { RouteRecordRaw } from 'vue-router'
import AppMain from '@/views/layout/AppMain.vue'
import FormTemplate from '@/views/components/FormTemplate.vue'
import TableTemplate from '@/views/components/TableTemplate.vue'
export const componentsCenter: RouteRecordRaw[] = [
  {
    path: '/components',
    name: 'components',
    component: AppMain,
    meta: {
      title: '组件中心'
    },
    children: [
      {
        path: '/components/form',
        component: FormTemplate,
        meta: {
          title: '表单组件'
        }
      },
      {
        path: '/components/table',
        component: TableTemplate,
        meta: {
          title: '表格组件'
        }
      }
    ]
  }
]
