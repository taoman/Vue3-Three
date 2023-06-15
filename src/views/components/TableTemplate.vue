<template>
  <div>
    <app-search v-model="state.formState" @search="onSearch" @reset="onReset">
      <template #formConent="{ modelRef }">
          <a-form-item label="用户名">
            <a-input v-model:value="modelRef.name" placeholder="请输入用户名" />
          </a-form-item>
          <a-form-item label="品牌">
            <app-select v-model:value="modelRef.brand" type="brand" placeholder="请选择品牌" />
          </a-form-item>
          <a-form-item label="门店">
            <app-select v-model:value="modelRef.store" type="store" placeholder="请选择门店" />
          </a-form-item>
        <a-form-item label="日期">
          <a-range-picker
            style="width: 250px"
            v-model:value="modelRef.date"
            :ranges="ranges"
            :placeholder="['开始日期', '结束日期']"
          />
        </a-form-item>
      </template>
    </app-search>
    <a-table
      :row-key="(record) => record.key"
      :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data-source="data"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'status'">
          <a-tag color="green">成功</a-tag>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <a-tag color="#55acee" @click="edit(record)">
            <template #icon>
              <edit-outlined />
            </template>
            编辑
          </a-tag>
          <a-tag color="error" @click="del(record)">
            <template #icon>
              <delete-outlined />
            </template>
            删除
          </a-tag>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import dayjs, { Dayjs } from 'dayjs'
type Key = string | number
type RangeValue = [Dayjs, Dayjs]
interface DataType {
  key: Key
  name: string
  brand: string
  status: string
  date: string
  store: string
}
interface FormState {
  key: Key
  name: string
  brand: string
  status: string
  store: string
  date?: [Dayjs, Dayjs];
}
const ranges = {
  今天: [dayjs(), dayjs()] as RangeValue,
  本月: [dayjs().startOf('month'), dayjs().endOf('month')] as RangeValue
}
const columns = [
  {
    title: '用户名',
    dataIndex: 'name'
  },
  {
    title: '所属品牌',
    dataIndex: 'brand'
  },
  {
    title: '店铺',
    dataIndex: 'store'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '注册时间',
    dataIndex: 'date'
  },
  {
    title: '操作',
    dataIndex: 'operation'
  }
]
const data: DataType[] = []
for (let i = 0; i < 41; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    brand: 'nike',
    status: '成功',
    date: '2023-1-1',
    store: `London, Park Lane no. ${i}`
  })
}
const state = reactive<{
  selectedRowKeys: Key[]
  formState: FormState
  loading: boolean
}>({
  selectedRowKeys: [],
  formState: {
    key: '',
    brand: '',
    name: '',
    status: '',
    store: '',
    date: undefined
  },
  loading: false
})
const onSelectChange = (selectedRowKeys: Key[]) => {
  console.log('selectedRowKeys changed: ', selectedRowKeys)
  state.selectedRowKeys = selectedRowKeys
}
const onSearch = () => {
  const { name, brand, store, date } = state.formState
  let startDate: string | undefined
  let endDate: string | undefined
  if (date) {
    startDate = date[0].format('YYYY-MM-DD')
    endDate = date[1].format('YYYY-MM-DD')
  }
  console.log('search', startDate,endDate)
}
const onReset = () => {
  console.log('onReset')
}
const edit = (record: DataType) => {
  console.log('record', record)
}
const del = (record: DataType) => {
  console.log('record', record)
}
</script>

<style lang="scss" scoped></style>
