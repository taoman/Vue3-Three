<template>
  <div ref="container" class="list" @scroll="handleScroll">
    <div class="list-content" :style="{ height: `${totalHeight}px` }">
      <div
        v-for="item in visibleItems"
        :key="messages[item.index]?.id || item.index"
        class="list-item"
        :style="{
          transform: `translateY(${item.top}px)`,
          height: `${itemHeights[item.index]}px`
        }"
        ref="itemRefs"
      >
        {{ messages }}
        <div class="message-content">{{ messages[item.index]?.content }}</div>
        <!-- {{ item.index }} -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'

const container = ref<HTMLElement | null>(null)
const messages = ref<Array<{ id: string; content: string }>>([])
const itemHeights = ref<number[]>([])
const positions = ref<number[]>([])
const itemRefs = ref<HTMLElement[]>([])
// 添加新消息
const addMessage = (msg: { id: string; content: string }) => {
  messages.value.push(msg)
  itemHeights.value.push(0) // 初始高度设为0，渲染后更新

  nextTick(() => {
    // 渲染后更新实际高度
    updateAllHeights()
    scrollToBottom()
  })
}
// 滚动到底部
const scrollToBottom = () => {
  if (container.value) {
    container.value.scrollTop = container.value.scrollHeight
  }
}

// 计算位置
const calculatePositions = () => {
  positions.value = itemHeights.value.reduce(
    (acc, height, index) => {
      acc.push((acc[index] || 0) + height)
      return acc
    },
    [0]
  )
}

const totalHeight = computed(() => {
  return positions.value[messages.value.length] || 0
})

const scrollTop = ref(0)

const visibleRange = computed(() => {
  if (!container.value || positions.value.length === 0) return { start: 0, end: 0 }

  const startPos = scrollTop.value
  const endPos = scrollTop.value + container.value.clientHeight

  // 二分查找找到起始和结束索引
  const findIndex = (pos: number) => {
    let left = 0
    let right = messages.value.length - 1
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
    end: Math.min(messages.value.length - 1, findIndex(endPos) + 1)
  }
})
// 更新所有项目高度
const updateAllHeights = () => {
  itemRefs.value.forEach((el, index) => {
    if (el) {
      const height = el.getBoundingClientRect().height
      if (itemHeights.value[index] !== height) {
        itemHeights.value[index] = height
      }
    }
  })
  calculatePositions()
}
const visibleItems = computed(() => {
  const { start, end } = visibleRange.value
  console.log('visibleItems',start, end)
  if (start < 0 || end < 0) return []

  return Array.from({ length: end - start + 1 }, (_, i) => {
    const index = start + i
    return {
      index,
      top: positions.value[index] || 0,
      key: messages.value[index]?.id || index
    }
  })
})

function handleScroll() {
  if (container.value) {
    scrollTop.value = container.value.scrollTop
  }
}

// 初始化加载示例数据
onMounted(() => {
  // 模拟初始加载
  setTimeout(() => {
    addMessage({ id: '1', content: '你好！这是一条较短的测试消息' })
    addMessage({
      id: '2',
      content:
        '有什么可以帮您的？这是一条稍长一些的测试消息，用于展示不同高度的消息项。虚拟列表应该能正确处理这种动态高度的内容。'
    })
  }, 500)

  // 模拟后续消息
  setInterval(() => {
    const msgLength = Math.floor(Math.random() * 5) + 1
    let content = `新消息 ${new Date().toLocaleTimeString()} - `
    content += '这是一条'.repeat(msgLength) + '随机长度的测试消息'

    addMessage({
      id: Date.now().toString(),
      content
    })
  }, 3000)
})

// 监听itemRefs变化，自动更新高度
watch(
  itemRefs,
  () => {
    nextTick(updateAllHeights)
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.list {
  width: 500px;
  height: 500px;
  overflow: auto;
  position: relative;
  border: 1px solid #ddd;

  &-content {
    position: relative;
  }

  &-item {
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    border-bottom: 1px solid #eee;

    .message-content {
      white-space: pre-wrap;
      word-break: break-word;
      background: #f5f5f5;
      padding: 8px 12px;
      border-radius: 4px;
      display: inline-block;
      max-width: 80%;
    }
  }
}
</style>
