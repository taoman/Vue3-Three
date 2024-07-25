import { DataType } from '@/interface/table'
import { defineStore } from 'pinia'
export interface AppStoreType {
  count: number
  isModelFullScreen: boolean
  tableData: DataType[]
}
export const appStore = defineStore('app-store', {
  state: (): AppStoreType => ({
    count: 1,
    isModelFullScreen: false,
    tableData: []
  }),
  getters: {
    getTableData(): DataType[] {
      return this.tableData
    }
  },
  actions: {
    setTableData(data: DataType[]) {
      this.tableData = data
    }
  }
})
export function useAppStoreHook() {
  return appStore()
}
