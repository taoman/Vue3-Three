<template>
  <div>
    <a-button type="primary" @click="create">创建数据库</a-button>
    <a-button type="primary" @click="addData" style="margin: 0 20px">新增数据</a-button>
    <!-- <a-button type="primary" @click="getData">获取</a-button> -->
  </div>
  <a-progress :percent="percent" />
  <a-input
    v-model:value="value"
    placeholder="内容"
    @change="handleChange"
    allowClear
    style="margin: 20px 0"
  />
  <a-table
    :row-key="(record: any) => record.key"
    :columns="columns"
    :data-source="resultData"
    :scroll="{ y: 600 }"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'status'">
        <a-tag color="green">{{ record.status }}</a-tag>
      </template>
      <template v-if="column.dataIndex === 'isStart'">
        <a-switch v-model:checked="record.checked" checked-children="开" un-checked-children="关" />
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-tag color="#55acee">
          <template #icon>
            <edit-outlined />
          </template>
          编辑
        </a-tag>
        <a-tag color="error">
          <template #icon>
            <delete-outlined />
          </template>
          删除
        </a-tag>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { DataType } from '@/interface/table'
import { message } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { appStore } from '@/stores/app-stores'
import { getTableData } from '@/api/table'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

const app = appStore()
const dataSource = ref<DataType[]>([])
const resultData = ref<DataType[]>([])
const value = ref<string>('')
const percent = ref(0)
const columns = [
  { title: '负责人', dataIndex: 'name' },
  { title: '风机', dataIndex: 'turbines' },
  { title: '部件', dataIndex: 'witgets' },
  { title: '状态', dataIndex: 'status' },
  { title: '运行', dataIndex: 'isStart' },
  { title: '日期', dataIndex: 'date' },
  { title: '操作', dataIndex: 'operation' }
]
const db = ref<IDBDatabase | null>(null)
const dbName = ref('demo')

const openDb = (name: string, version: number) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(name, version)
    request.onsuccess = (event: Event) => {
      db.value = (event.target as IDBOpenDBRequest).result
      console.log('数据库打开成功', db)
      resolve(db)
    }
    request.onerror = (event: any) => {
      console.log('数据库打开报错')
      reject(event)
    }
    request.onupgradeneeded = (event: Event) => {
      db.value = (event.target as IDBOpenDBRequest).result
      if (!db.value.objectStoreNames.contains('objectStore')) {
        db.value.createObjectStore('objectStore', { keyPath: 'id' })
      }
    }
  })
}

const addData = async () => {
  if (!db.value) return message.warning('数据库未打开')

  const transaction = db.value.transaction(['objectStore'], 'readwrite')
  const objectStore = transaction.objectStore('objectStore')

  const totalData = dataSource.value.length
  let writtenData = 0
  const batchSize = 1000 // 每批处理的数量

  const addBatch = (start: number, end: number) => {
    return new Promise((resolve) => {
      for (let i = start; i < end; i++) {
        const item = dataSource.value[i]
        const request = objectStore.add({ ...item })
        request.onsuccess = () => {
          writtenData++
          if (writtenData % batchSize === 0) {
            percent.value = Math.round((writtenData / totalData) * 100)
          }
        }
        request.onerror = (event: Event) => {
          console.log('数据写入失败', event)
        }
      }
      resolve(null)
    })
  }

  for (let i = 0; i < totalData; i += batchSize) {
    const start = i
    const end = Math.min(i + batchSize, totalData)
    await addBatch(start, end)
  }

  transaction.oncomplete = () => {
    console.log('所有数据写入完成')
    message.success('数据写入完成')
  }

  transaction.onerror = () => {
    console.log('事务失败')
    message.error('数据写入失败')
  }
}

const getData = () => {
  if (!db.value) return message.warning('数据库未打开')
  const transaction = db.value.transaction(['objectStore'], 'readonly')
  const objectStore = transaction.objectStore('objectStore')
  const request = objectStore.getAll()
  request.onerror = (event) => {
    console.log('事务失败')
  }
  request.onsuccess = (event) => {
    console.log('主键查询结果: ', request.result)
    resultData.value = request.result
    app.setTableData(request.result)
  }
}

const create = () => {
  openDb(dbName.value, 1)
  message.success('创建成功')
}

const init = async () => {
  const data = { page: 1, pageSize: 100000 }
  const res = await getTableData(data)
  dataSource.value = res.data.list
}

const handleChange = () => {
  const searchTerm = value.value.toLowerCase()
  resultData.value = dataSource.value.filter((item) =>
    Object.values(item).some((val) => String(val).toLowerCase().includes(searchTerm))
  )
}

onMounted(() => {
  // create()
  init()
})
</script>

<style lang="scss" scoped></style>
