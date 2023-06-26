<template>
  <div>
    <app-search
      v-model="state.formState"
      :rules="state.rulesState"
      @search="onSearch"
      @reset="onReset"
    >
      <template #formConent="{ modelRef, validateInfos }">
        <a-form-item label="负责人">
          <a-input v-model:value="modelRef.name" placeholder="请输入负责人" />
        </a-form-item>
        <a-form-item label="风机" v-bind="validateInfos.turbines">
          <app-select v-model:value="modelRef.turbines" type="turbines" placeholder="请选择风机" />
        </a-form-item>
        <a-form-item label="部件" v-bind="validateInfos.witgets">
          <app-select v-model:value="modelRef.witgets" type="witgets" placeholder="请选择部件" />
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
      :row-key="(record:any) => record.key"
      :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :pagination="pagination"
      :data-source="dataSource"
      :scroll="{ y: 600 }"
      @change="handleTableChange"
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
    <app-modal
      v-model:modalVisible="modalVisible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form v-bind="modalFormLayout" :model="state.editFormState">
        <a-form-item name="name" label="Name">
          <a-input v-model:value="state.editFormState.name" />
        </a-form-item>
        <a-form-item name="turbines" label="Turbines">
          <app-select
            v-model:value="state.editFormState.turbines"
            :width="315"
            type="turbines"
            placeholder="请选择风机"
          />
        </a-form-item>
      </a-form>
    </app-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import dayjs, { Dayjs } from 'dayjs'
import { getTableData } from '@/api/table'
import { Rule } from 'ant-design-vue/es/form'
type Key = string | number
type RangeValue = [Dayjs, Dayjs]
interface DataType {
  id: number
  name: string
  turbines: string
  status: string
  date: string
  witgets: string
}
interface FormState {
  name: string
  turbines?: string
  witgets?: string
  date?: [Dayjs, Dayjs]
}
const ranges = {
  今天: [dayjs(), dayjs()] as RangeValue,
  本月: [dayjs().startOf('month'), dayjs().endOf('month')] as RangeValue
}
const columns = [
  {
    title: '负责人',
    dataIndex: 'name'
  },
  {
    title: '风机',
    dataIndex: 'turbines'
  },
  {
    title: '部件',
    dataIndex: 'witgets'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '日期',
    dataIndex: 'date'
  },
  {
    title: '操作',
    dataIndex: 'operation'
  }
]
const dataSource = ref<DataType[]>()
const total = ref()
const current = ref(1)
const pageSize = ref(10)
const modalVisible = ref(false)
const modalFormLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const state = reactive<{
  selectedRowKeys: Key[]
  formState: FormState
  editFormState: FormState
  rulesState: Record<keyof FormState, Rule[]>
  loading: boolean
}>({
  selectedRowKeys: [],
  formState: {
    name: '',
    turbines: undefined,
    witgets: undefined,
    date: undefined
  },
  editFormState: {
    name: '',
    turbines: undefined,
    witgets: undefined,
    date: undefined
  },
  rulesState: {
    turbines: [{ required: true, message: '请选择风机' }],
    witgets: [{ required: true, message: '请选择部件' }],
    name: [],
    date: []
  },
  loading: false
})

const onSelectChange = (selectedRowKeys: Key[]) => {
  state.selectedRowKeys = selectedRowKeys
}
const onSearch = () => {
  const { name, turbines, witgets, date } = state.formState
  let startDate: string | undefined
  let endDate: string | undefined
  if (date) {
    startDate = date[0].format('YYYY-MM-DD')
    endDate = date[1].format('YYYY-MM-DD')
  }
  console.log('search', name, turbines, witgets, startDate, endDate)
}
const onReset = () => {
  console.log('onReset')
}
const edit = (record: DataType) => {
  console.log('record', record)
  state.editFormState = {
    name: record.name,
    turbines: record.turbines,
    witgets: record.witgets,
    date: [dayjs(record.date), dayjs(record.date)]
  }
  modalVisible.value = true
}
const del = (record: DataType) => {
  console.log('record', record)
}
const getData = async () => {
  const data = {
    page: current.value,
    pageSize: pageSize.value
  }

  const res = await getTableData({ data } as any)
  dataSource.value = res.data.list
  total.value = res.data.total
  current.value = res.data.page
  pageSize.value = res.data.pageSize
}
const pagination = computed(() => {
  return {
    current: current.value,
    pageSize: pageSize.value,
    total: total.value,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`
  }
})
const handleTableChange = (pag: any) => {
  current.value = pag.current
  pageSize.value = pag.pageSize
  getData()
}
const confirmLoading = ref(false)
const handleOk = async () => {
  console.log('handleOk', state.editFormState)
  confirmLoading.value = true
  setTimeout(() => {
    modalVisible.value = false
    confirmLoading.value = false
  }, 2000)
}
const handleCancel = () => {
  modalVisible.value = false
}
onMounted(async () => {
  // axios.get('/api/table/list',{data}).then((res) => {
  //   console.log('res', res)
  // })
  getData()
})
</script>

<style lang="scss" scoped></style>
