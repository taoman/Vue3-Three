<template>
  <div>
    <WidgetPanel title="发电监测">
      <div ref="chartRef" class="container"></div>
    </WidgetPanel>
  </div>
</template>

<script setup lang="ts">
import WidgetPanel from '../WidgetPanel.vue'
import * as echarts from 'echarts'
import { ref, onMounted,markRaw } from 'vue'
type EChartsOption = echarts.EChartsOption
const chartRef = ref()
const myChart = ref()
const init = () => {
  myChart.value = markRaw(echarts.init(chartRef.value))
  const  option:EChartsOption = {
    xAxis: {
      type: 'category',
      axisTick:{
        show:false
      },
      axisLabel:{
        interval:0,
        rotate:40,
        color:'#fff'
      },
      data: ['#1风机', '#2风机', '#3风机', '#4风机', '#5风机', '#6风机']
    },
    yAxis: {
      show:false,
      type: 'value'
    },
    series: [
      {
        data: [
          {
            value:20,
            itemStyle:{
              color:'#95ceff'
            }
          },
          {
            value: 40,
            itemStyle: {
              color: '#A9FF96'
            }
          },
          {
            value: 150,
            itemStyle: {
              color: '#E8A55E'
            }
          },
          {
            value: 81,
            itemStyle: {
              color: '#999EFF'
            }
          },
          {
            value: 70,
            itemStyle: {
              color: '#FF7599'
            }
          },
          {
            value: 110,
            itemStyle: {
              color: '#44A9A8'
            }
          },
        ],
        label:{
          show:true,
          position:'top'
        },
        type: 'bar'
      }
    ]
  };
  option && myChart.value.setOption(option);
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
