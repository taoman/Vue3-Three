<template>
  <template v-if="menuInfo.children">
    <a-sub-menu :key="menuInfo.path" :title="menuInfo.meta?.title">
      <template #icon>
        <MailOutlined />
      </template>
      <template v-for="item in children" :key="item.path">
        <app-sub-menu :menu-info="item" />
      </template>
    </a-sub-menu>
  </template>
  <template v-else>
    <a-menu-item :key="menuInfo.path" @click="toPage(menuInfo)">
      <template #icon>
        <MailOutlined />
      </template>
      {{ menuInfo.meta?.title }}
    </a-menu-item>
  </template>
</template>

<script setup lang="ts">
import { RouteRecordRaw, useRouter } from 'vue-router'
import { MailOutlined } from '@ant-design/icons-vue'
import { computed } from 'vue'
const router = useRouter()
const props = defineProps<{ menuInfo: RouteRecordRaw }>()
const children = computed(() => {
  return props.menuInfo?.children?.filter((item) => !item.meta?.hidden) ?? []
})
const toPage = (e: RouteRecordRaw) => {
  router.push(e.path)
}
</script>

<style lang="scss" scoped></style>
