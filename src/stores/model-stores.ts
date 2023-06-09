import { filter, map, sortBy } from 'lodash'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
export type ModuleNameType = 'MonitorActive' | 'MonitorEnergy' | 'MonitorError' | 'MonitorYawAngle' | 'MonitorStatistics' | 'MonitorEnv'
export type ModuleType = Record<
ModuleNameType,
{
  key: ModuleNameType
  label: string
  visible: boolean
  updateTime: number
}
>
export const appModelStore = defineStore('app-model-stroe', () => {
  const modelModules = ref<ModuleType>()
  modelModules.value = {
    MonitorActive: {
      key: 'MonitorActive',
      label: '活动监测',
      visible: true,
      updateTime: 1
    },
    MonitorEnergy: {
      key: 'MonitorEnergy',
      label: '发电监测',
      visible: true,
      updateTime: 2,
    },
    MonitorEnv: {
      key: 'MonitorEnv',
      label: '环境监测',
      visible: true,
      updateTime: 3,
    },
    MonitorError: {
      key: 'MonitorError',
      label: '异常监测',
      visible: true,
      updateTime: 4
    },
    MonitorStatistics: {
      key: 'MonitorStatistics',
      label: '参数监测',
      visible: true,
      updateTime: 5,
    },
    MonitorYawAngle: {
      key: 'MonitorYawAngle',
      label: '偏航角度监测',
      visible: true,
      updateTime: 6
    }
  }
  const validModules = computed(()=>{
    const list = sortBy(filter(modelModules.value, 'visible'), 'updateTime')
    console.log('list', list)
    return map(list,'key')
  })
  const chunkModules = computed(() => ({
    
    left: validModules.value.slice(0, 3),
    right: validModules.value.slice(3, 6),
  }))
  return { chunkModules }
})
