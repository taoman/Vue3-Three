<template>
  <div class="tags" v-if="tagsStore.show">
    <div class="tags-item" :class="{ active: isActive(item.path) }"  v-for="(item, index) in tagsStore.tagsLists" :key="index">
      <router-link class="tags-item-link" :to="item.path">{{ item.title }}</router-link>
      <close-outlined @click="close(index)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {  useRoute, useRouter } from 'vue-router'
import { appTagStore } from '@/stores/tag-stores'
import { CloseOutlined } from '@ant-design/icons-vue'
import { watch } from 'vue'
const route = useRoute()
const router = useRouter()
const tagsStore = appTagStore()
const isActive = (path: string) => {
  return path === route.fullPath;
};
const setTags = (route: any) => {
  const isExist = tagsStore.tagsLists.some((item) => item.path === route.fullPath)
  if (isExist) return
  tagsStore.setTagsItem({
    title: route.meta.title,
    path: route.fullPath
  })
}
setTags(route)
watch(route, (value) => {
  setTags(value)
})

const close = (index: number) => {
  const tag = tagsStore.tagsLists[index]
  tagsStore.removeTagsItem(index)
  if (isActive(tag.path)) {
    const nextTag = tagsStore.tagsLists[index] || tagsStore.tagsLists[index - 1]
    if (nextTag) {
      router.push(nextTag.path)
    }else{
      router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.tags {
  display: flex;
  padding: 4px 20px;
  box-sizing: border-box;
  background: #fff;
  &-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 25px;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 2px;
    cursor: pointer;
    transition: all 0.3s ease-in;
    margin-right: 10px;
    &-link{
        color: #666;
    }
    &.active {
      background: #1890ff;
      color: #fff;
      border: 1px solid #1890ff;
      a{
        color: #fff;
      }
    }
    }
    
  :deep(.anticon svg) {
    margin-left: 5px;
    width: 10px;
    height: 10px;
  }
}
</style>
