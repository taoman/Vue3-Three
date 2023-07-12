<template>
  <div>
    <a-menu
      :selectedKeys="[route.path]"
      :open-keys="openKeys"
      :inline-collapsed="collapsed"
      mode="inline"
      theme="dark"
    >
      <template v-for="item in menuRoutes" :key="item.path">
        <app-sub-menu :menu-info="item" />
      </template>
    </a-menu>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {usePermissionStoreHook} from '@/stores/permission-stores'
import { storeToRefs } from 'pinia';
const route = useRoute()
// const menuRoutes = router.options.routes[0]
const {wholeMenus} = storeToRefs(usePermissionStoreHook())
const menuRoutes =  wholeMenus
const fullPathList = route.path.split('/')
// const selectedKeys = ref(fullPathList)
const openKeys = ref(fullPathList)
const collapsed = ref<boolean>(false)
watch(route, (value) => {
  openKeys.value = value.matched.map((item) => item.path)
})

</script>
