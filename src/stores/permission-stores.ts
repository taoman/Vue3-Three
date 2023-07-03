import { defineStore } from 'pinia'
import { constantMenus } from '@/router'
export const permissionStore = defineStore('permission-store', {
  state: () => ({
    constantMenus,
    wholeMenus: []
  }),
  actions: {
    async initRouter() {
    }
  }
})
