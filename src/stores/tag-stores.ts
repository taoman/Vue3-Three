import { defineStore } from 'pinia'

interface ListTtem {
  path: string;
  title: string;
}
export const appTagStore = defineStore('app-tag-store', {
  state: () => ({
    tagsLists:<ListTtem[]> []
  }),
  getters: {
    show: (state) => state.tagsLists.length > 0,
  },
  actions:{
    setTagsItem(data: ListTtem) {
      this.tagsLists.push(data)
    },
    removeTagsItem(index: number) {
      this.tagsLists.splice(index, 1)
    }
    
  }
})