<template>
  <div ref="container" class="list" @scroll="handleScroll">
    <div class="list-content" :style="{ height: `${totalHeight}px` }">
      <div
        v-for="item in visibleItems"
        :key="item.index"
        class="list-item"
        :style="{ transform: `translateY(${item.top}px)` }"
      >
        <div>{{ item.index }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const container = ref<HTMLElement | null>(null)
const itemHeight = 50
const totalItems = 10000
const totalHeight = itemHeight * totalItems
const scrollTop = ref(0)

const visibleCount = computed(() => {
  if (!container.value) return 0
  return Math.ceil(container.value.clientHeight / itemHeight) + 2
})

const startIndex = computed(() => {
  return Math.max(0, Math.floor(scrollTop.value / itemHeight) - 1)
})

const visibleItems = computed(() => {
  return Array.from({ length: visibleCount.value }, (_, i) => {
    const index = startIndex.value + i
    return {
      index,
      top: index * itemHeight
    }
  }).filter((item) => item.index < totalItems)
})

function handleScroll() {
  if (container.value) {
    scrollTop.value = container.value.scrollTop
  }
}

onMounted(() => {
  if (container.value) {
    container.value.scrollTop = 0
  }
})
</script>

<style lang="scss" scoped>
.list {
  width: 500px;
  height: 500px;
  overflow: auto;
  position: relative;

  &-content {
    position: relative;
  }

  &-item {
    height: 50px;
    border: 1px solid #ccc;
    position: absolute;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
