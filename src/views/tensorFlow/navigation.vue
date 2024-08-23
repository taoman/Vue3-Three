<template>
  <a-button type="primary" @click="random" style="margin-bottom: 10px;">随机生成高亮点</a-button>
  <div class="container">
    <div
      v-for="(item, index) in 100"
      :key="item"
      :class="{ box: true, obstacle: isObstacle(index) }"
    >
      {{ getCoordinates(index) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const obstacleIndices = ref<number[]>([])
const getCoordinates = (index: number) => {
  const row = Math.floor(index / 10) + 1
  const col = (index % 10) + 1
  return `${row},${col}`
}

const random = () => {
  obstacleIndices.value = []
  while (obstacleIndices.value.length < 50) {
    const randomIndex = Math.floor(Math.random() * 100)
    if (!obstacleIndices.value.includes(randomIndex)) {
      obstacleIndices.value.push(randomIndex)
    }
  }
}
const isObstacle = (index: number) => {
  return obstacleIndices.value.includes(index)
}
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-template-columns: repeat(10, 40px); /* 每行10个盒子，每个40px宽 */
  grid-template-rows: repeat(10, 40px); /* 每列10个盒子，每个40px高 */
  gap: 10px; /* 盒子之间的间隙 */
  width: calc(40px * 10 + 10px * 9); /* 容器宽度: 40px * 10 (宽度) + 10px * 9 (间隙) */
  height: calc(40px * 10 + 10px * 9); /* 容器高度: 40px * 10 (高度) + 10px * 9 (间隙) */
  border: 1px solid #ccc;
  .box {
    // height: 40px;
    border: 1px solid #ccc;
  }
  .obstacle {
    background-color: #ff4d4f; /* 红色背景，用于区分障碍点 */
  }
}
</style>
