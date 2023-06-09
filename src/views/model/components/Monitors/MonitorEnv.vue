<template>
  <div>
    <WidgetPanel title="环境监测">
      <div ref="chartRef" class="container"></div>
    </WidgetPanel>
  </div>
</template>

<script setup lang="ts">
import WidgetPanel from '../WidgetPanel.vue'
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
type EChartsOption = echarts.EChartsOption
const chartRef = ref()
const myChart = ref()
const init = () => {
  myChart.value = echarts.init(chartRef.value)
  
  const option: EChartsOption = {
    legend: {
      top: 'bottom',
      textStyle:{
        color:'#fff'
      }
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    series: [
      {
        name: '环境',
        type: 'pie',
        radius: [20, 80],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: [
          { value: 40, name: '停机' },
          { value: 38, name: '故障' },
          { value: 32, name: '正常' },
          { value: 30, name: '保养' }
        ]
      }
    ],
    grid: {}
  }
  option && myChart.value.setOption(option)
}
onMounted(() => {
  init()
  myChart.value.resize()
})
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
