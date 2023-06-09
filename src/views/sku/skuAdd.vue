<template>
  <section>skuadd1</section>
</template>

<script setup lang="ts">
import { appStore } from '@/stores/app-stores'
const app = appStore()
console.log(app.count)
</script>

<style lang="scss" scoped></style>
