<template>
  <WidgetPanel title="活动监测">
    <base-table  :columns="columns" :data="dataSource"></base-table>
  </WidgetPanel>
</template>

<script setup lang='ts'>
import { reactive } from 'vue';
import BaseTable from '../BaseTable.vue';
import WidgetPanel from '../WidgetPanel.vue';
const columns = [
  {
    title: '部件名称',
    dataIndex: 'name',
    width: '25%',
  },
  {
    title: '监测时间',
    dataIndex: 'time',
    width: '55%',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '20%',
  },
]
const dataSource = reactive([
  {
    name: '发动机',
    time: '2023/04/02 12:00',
    status: '正常',
  },
  {
    name: '齿轮箱',
    time: '2023/04/02 12:00',
    status: '正常',
  },
  {
    name: '变桨系统',
    time: '2023/04/02 12:00',
    status: '正常',
  },
  {
    name: '主轴',
    time: '2023/04/02 12:00',
    status: '正常',
  },
  {
    name: '叶片',
    time: '2023/04/02 12:00',
    status: '正常',
  },
  {
    name: '偏航角度',
    time: '2023/04/02 12:00',
    status: '正常',
  },
  {
    name: '发动机',
    time: '2023/04/02 12:00',
    status: '正常',
  },
  {
    name: '齿轮箱',
    time: '2023/04/02 12:00',
    status: '正常',
  },
  {
    name: '变桨系统',
    time: '2023/04/02 12:00',
    status: '正常',
  },
  {
    name: '主轴',
    time: '2023/04/02 12:00',
    status: '正常',
  },
  {
    name: '叶片',
    time: '2023/04/02 12:00',
    status: '正常',
  },
  {
    name: '偏航角度',
    time: '2023/04/02 12:00',
    status: '正常',
  },
])
</script>

<style lang='scss' scoped>

</style>