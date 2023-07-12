<template>
  <div class="content">
    <div class="header">
      <a-card title="今日新闻" style="width: 48%; height: 300px">
        <a-list item-layout="horizontal" size="small" :data-source="newLists">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta
                :description="item.date"
              >
                <template #title>
                  <a :href="item.url" target="_blank" >{{ item.title }}</a>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-card>
      <a-card title="个人信息" style="width: 48%">
        <a-table
          class="ant-table-striped"
          size="middle"
          :columns="columns"
          :data-source="data"
          :pagination="false"
          bordered
        >
          <template #headerCell="{ column }">
            <template v-if="column.dataIndex === 'name'">
              <span>
                <smile-outlined />
                姓名
              </span>
            </template>
            <template v-if="column.dataIndex === 'phone'">
              <span>
                <phone-outlined />
                电话
              </span>
            </template>
            <template v-if="column.dataIndex === 'address'">
              <span>
                <environment-outlined />
                地址
              </span>
            </template>
          </template>
        </a-table>
        <a-table
          class="ant-table-striped"
          size="middle"
          :columns="columns1"
          :data-source="data1"
          :pagination="false"
          bordered
        >
          <template #headerCell="{ column }">
            <template v-if="column.dataIndex === 'label'">
              <span>
                <reddit-outlined />
                标签
              </span>
            </template>
            <template v-if="column.dataIndex === 'sign'">
              <span>
                <file-text-outlined />
                个性签名
              </span>
            </template>
          </template>
          <template #bodyCell="{ column }">
            <template v-if="column.dataIndex === 'label'">
              <a-tag color="#f50">摩旅</a-tag>
              <a-tag color="#2db7f5">艺术</a-tag>
              <a-tag color="#87d068">文学</a-tag>
              <a-tag color="#108ee9">篮球</a-tag>
            </template>
            <template v-if="column.dataIndex === 'sign'"> 总要在路上吧！ </template>
          </template>
        </a-table>
      </a-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  SmileOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  RedditOutlined,
  FileTextOutlined
} from '@ant-design/icons-vue'
import { TableColumnType } from 'ant-design-vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'
interface NewsType {
  author_name: string
  category: string
  date: string
  is_content: string
  thumbnail_pic_s: string
  title: string
  uniquekey: string
  url: string
}
const columns: TableColumnType[] = [
  {
    title: 'Name',
    dataIndex: 'name'
  },
  { title: 'Age', dataIndex: 'phone' },
  { title: 'Address', dataIndex: 'address' }
]
const columns1: TableColumnType[] = [
  {
    title: 'label',
    dataIndex: 'label'
  },
  { title: 'sign', dataIndex: 'sign' }
]
const data = [
  {
    key: '1',
    name: 'admin',
    phone: 18888888888,
    address: '中华人民共和国'
  }
]
const data1 = [
  {
    key: '1',
    label: 'admin',
    sign: 18888888888
  }
]
const newLists = ref<NewsType[]>([])
const init = () => {
  axios.get<any>('api/toutiao/index?key=f7ea98aac2fa285f5096cc1e764d2306').then((res) => {
    newLists.value = res.data.result.data
  })
}
onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.content {
  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    background: #ececec;
    padding: 30px;
    :deep(.ant-card-body) {
      padding: 6px 12px;
    }
    :deep(.ant-list) {
      height: 200px;
      overflow: auto;
    }
   
  }
}
</style>
