import type { RouteRecordRaw } from 'vue-router'
import AppMain from '@/views/layout/AppMain.vue'
import skuList from '@/views/sku/skuList.vue'
import skuAdd from '@/views/sku/skuAdd.vue'
export const skuCenter: RouteRecordRaw[] = [
  {
    path: '/sku',
    name: 'sku',
    component: AppMain,
    meta: {
      title: 'sku中心'
    },
    children: [
      {
        path: '/sku/list',
        component: skuList,
        meta: {
          title: 'sku列表'
        }
      },
      {
        path: '/sku/add',
        component: skuAdd,
        meta: {
          title: 'sku新增'
        }
      }
    ]
  }
]
