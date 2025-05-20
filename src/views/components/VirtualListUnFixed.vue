<template>
  <div ref="container" class="list" @scroll="handleScroll">
    <div class="list-content" :style="{ height: `${totalHeight}px` }">
      <div
        v-for="item in visibleItems"
        :key="item.index"
        class="list-item"
        :style="{
          transform: `translateY(${item.top}px)`,
          height: `${itemHeights[item.index]}px`
        }"
        @vue:mounted="({ el }:any) => updateItemHeight(item.index, el.clientHeight)"
      >
        <div>Item {{ item.index }} ({{ itemHeights[item.index] }}px)</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const container = ref<HTMLElement | null>(null)
const totalItems = 100
const itemHeights = ref<number[]>(Array(totalItems).fill(0))
const positions = ref<number[]>([])

// 计算每个项目的累计位置
const calculatePositions = () => {
  positions.value = itemHeights.value.reduce(
    (acc, height, index) => {
      acc.push((acc[index] || 0) + height)
      return acc
    },
    [0]
  ) // 初始位置为0
}

const totalHeight = computed(() => {
  return positions.value[totalItems] || 0
})

const scrollTop = ref(0)

const visibleRange = computed(() => {
  if (!container.value || positions.value.length === 0) return { start: 0, end: 0 }

  const startPos = scrollTop.value
  const endPos = scrollTop.value + container.value.clientHeight
  // 二分查找找到起始和结束索引
  const findIndex = (pos: number) => {
    let left = 0
    let right = totalItems - 1
    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      if (positions.value[mid] <= pos && positions.value[mid + 1] > pos) {
        return mid
      } else if (positions.value[mid] < pos) {
        left = mid + 1
      } else {
        right = mid - 1
      }
    }
    return 0
  }
  return {
    start: Math.max(0, findIndex(startPos) - 1),
    end: Math.min(totalItems - 1, findIndex(endPos) + 1)
  }
})

const visibleItems = computed(() => {
  const { start, end } = visibleRange.value
  return Array.from({ length: end - start + 1 }, (_, i) => {
    const index = start + i
    return {
      index,
      top: positions.value[index]
    }
  })
})

function handleScroll() {
  if (container.value) {
    scrollTop.value = container.value.scrollTop
  }
}

// 模拟随机高度
onMounted(() => {
  if (container.value) {
    container.value.scrollTop = 0
    // 初始化随机高度 (实际项目中应该通过实际测量获取)
    itemHeights.value = Array(totalItems)
      .fill(0)
      .map(
        () => Math.floor(Math.random() * 100) + 30 // 30-130px随机高度
      )
    calculatePositions()
  }
})

// 实际项目中，当项目渲染后应该测量实际高度并更新
const updateItemHeight = (index: number, height: number) => {
  if (itemHeights.value[index] !== height) {
    itemHeights.value[index] = height
    calculatePositions()
  }
}
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
