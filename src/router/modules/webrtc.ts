import type { RouteRecordRaw } from 'vue-router'
import {RouterEnum} from '../enums'
import AppMain from '@/views/layout/AppMain.vue'
import webrtc from '@/views/webrtc/index.vue'
export const webrtcCenter: RouteRecordRaw[] = [
  {
    path: '/webrtc',
    name: 'webrtc',
    component: AppMain,
    meta: {
      title: 'webrtc通话',
      icon: 'components',
      rank: RouterEnum.webrtc
    },
    children: [
      {
        path: '/webrtc',
        name:'webrtc',
        component: webrtc,
        meta: {
          title: '视频通话',
          icon: 'form'
        }
      },
      {
        path: '/webrtc/video',
        name: 'webrtcVideo',
        component: () => import('@/views/webrtc/VideoIndex.vue'),
        meta: {
          title: '视频通话',
          icon: 'form',
          hidden: true,
          fullScreen: true
        }
      },
    ]
  }
]
