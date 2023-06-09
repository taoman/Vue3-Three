import { defineStore } from 'pinia'
export interface AppStoreType {
  count: number
}
export const appStore = defineStore('main', {
  state: (): AppStoreType => ({
    count: 1
  }),
  actions: {}
})
