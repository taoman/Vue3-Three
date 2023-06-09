<template>
  <a-breadcrumb separator=">">
    <a-breadcrumb-item v-for="item in breadcrumbData" :key="item">
      {{ item }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const breadcrumbData = computed(() => {
  return route.matched
    .map((item) => (item.meta.title as string | undefined) ?? '')
    .filter((item) => item)
})
</script>

<style lang="scss" scoped></style>
