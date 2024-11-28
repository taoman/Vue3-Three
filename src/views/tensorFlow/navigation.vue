<template>
  <div style="margin-bottom: 10px">
    <a-button type="primary" @click="random">随机生成高亮点</a-button>
    <a-button type="primary" @click="start" style="margin: 0 20px">开始</a-button>
    <a-button type="primary" @click="restart">重新开始</a-button>
  </div>

  <div class="container">
    <div
      v-for="(item, index) in 100"
      :key="item"
      :class="{ box: true, obstacle: isObstacle(index), path: isPath(index) }"
    >
      {{ getCoordinates(index) }}
    </div>
    <div class="character" :style="characterStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
// @ts-ignore
import { Graph, astar } from 'javascript-astar'
import { message } from 'ant-design-vue'

const obstacleIndices = ref<number[]>([])
const pathIndices = ref<number[]>([])
const characterPosition = ref({ x: 0, y: 0 })
// 所有点设置为1
const grid = ref(Array.from({ length: 10 }, () => Array(10).fill(1)))
let timer: any // 添加计时器变量
// 在页面上显示当前坐标
const getCoordinates = (index: number) => {
  const row = Math.floor(index / 10)
  const col = index % 10
  return `${row},${col}`
}
// 障碍点设置样式
const isObstacle = (index: number) => {
  return obstacleIndices.value.includes(index)
}
// 可通过点的样式
const isPath = (index: number) => {
  return pathIndices.value.includes(index) // 判断该点是否在路径上
}

// 从98个点里随机生成30个障碍点
const random = () => {
  obstacleIndices.value = []
  while (obstacleIndices.value.length < 30) {
    const randomIndex = Math.floor(Math.random() * 98) + 1
    // 不包括起点和终点
    if (!obstacleIndices.value.includes(randomIndex) && randomIndex !== 0 && randomIndex !== 99) {
      obstacleIndices.value.push(randomIndex)
    }
  }
  // 将障碍点的坐标转换为对应的索引，并将障碍点设置成0
  for (const index of obstacleIndices.value) {
    const row = Math.floor(index / 10)
    const col = index % 10
    grid.value[row][col] = 0
  }
  console.log('grid', grid.value)
}
// 重新开始初始化
const restart = () => {
  obstacleIndices.value = []
  pathIndices.value = []
  characterPosition.value = { x: 0, y: 0 }
  grid.value = Array.from({ length: 10 }, () => Array(10).fill(1))
  if (timer !== null) {
    clearTimeout(timer)
    timer = null // 重置计时器引用
  }
}
const start = () => {
  // 将处理好的二维数组(可通过点为1,不可通过为0)转换为Graph对象
  // { diagonal: true } 表示是否允许斜向移动
  const graph = new Graph(grid.value)
  console.log('开始', graph)
  // 起点和终点
  const start = graph.grid[0][0]
  const end = graph.grid[9][9]
  // heuristic 启发函数
  const result = astar.search(graph, start, end)
  console.log('result', result)
  if (!result.length) {
    return message.error('没有路径')
  }
  result.unshift(start)
  // return
  targDom(result)
  animateCharacter(result)
}
const targDom = (result: any) => {
  pathIndices.value = result.map((item: any) => {
    return item.x * 10 + item.y
  })
}
// 通过计算样式来更新人物的位置
const characterStyle = computed(() => ({
  transform: `translate(${characterPosition.value.y * 50}px, ${characterPosition.value.x * 50}px)`
}))
const animateCharacter = (path: any[]) => {
  let index = 0
  const move = () => {
    if (index >= path.length) {
      index = 0 // 重新开始
    }
    characterPosition.value = { x: path[index].x, y: path[index].y }
    console.log('characterPosition', characterPosition.value)

    index++
    timer = setTimeout(move, 500) // 每 500ms 移动一次
  }
  move()
}
// onMounted(() => {
//   init()
// })
</script>

<style lang="scss" scoped>
.container {
  position: relative;
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
  .path {
    background-color: yellow; /* 路径点的颜色 */
  }
  .character {
    position: absolute;
    width: 40px;
    height: 40px;
    background-color: green; /* 用红色表示人物 */
    transition: transform 0.5s ease; /* 使用 CSS transition 实现平滑动画 */
  }
}
</style>
