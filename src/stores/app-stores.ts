import { defineStore } from 'pinia'
export interface AppStoreType {
  count: number
  isModelFullScreen:boolean
}
export const appStore = defineStore('app-store', {
  state: (): AppStoreType => ({
    count: 1,
    isModelFullScreen:false
  }),
  actions: {}
})
export function useAppStoreHook() {
  return appStore()
}