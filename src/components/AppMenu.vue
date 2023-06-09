<template>
  <div>
    <a-menu
      v-model:selectedKeys="selectedKeys"
      v-model:open-keys="openKeys"
      :inline-collapsed="collapsed"
      mode="inline"
      theme="dark"
    >
      <template v-for="item in menuRoutes.children" :key="item.path">
        <app-sub-menu :menu-info="item" />
      </template>
    </a-menu>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const menuRoutes = router.options.routes[0]
const fullPathList = route.path.split('/')
fullPathList.shift()
const selectedKeys = ref(fullPathList)
const openKeys = ref(fullPathList)
const collapsed = ref<boolean>(false)
// }
</script>
