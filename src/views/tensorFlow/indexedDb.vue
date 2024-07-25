<template>
  <div>
    <a-button type="primary" @click="create">创建</a-button>
    <a-button type="primary" @click="addData">新增</a-button>
    <a-button type="primary" @click="getData">获取</a-button>
  </div>
</template>

<script setup lang="ts">
import { DataType } from '@/interface/table'
import { message } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { appStore } from '@/stores/app-stores'
import { getTableData } from '@/api/table'
const app = appStore()
const dataSource = ref<DataType[]>([])
// const dataSource:DataType[] = []
// for (let i = 0; i < 10000; i++) {
//   dataSource.value.push({
//     id: i,
//     name: `张三${i}`,
//     turbines: `#${i}号风机`,
//     witgets: '发动机',
//     status: '正常',
//     checked: i % 2 === 0 ? false : true,
//     date: '2021-09-01'
//   })
// }
const db = ref<IDBDatabase | null>(null)
const dbName = ref('demo')
const openDb = (name: string, version: number) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(name, version)
    request.onsuccess = (event: Event) => {
      //   db = event.target.result
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
        db.value.createObjectStore('objectStore', {
          keyPath: 'id'
        })
      }
    }
  })
}

const addData = () => {
  if (!db.value) return message.warning('数据库未打开')

  const transaction = db.value.transaction(['objectStore'], 'readwrite')
  const objectStore = transaction.objectStore('objectStore')
  dataSource.value.forEach((item) => {
    console.log('item', item)
    const request = objectStore.add({...item})
    request.onsuccess = (event: Event) => {
      console.log('数据写入成功', event)
    }
    request.onerror = (event: Event) => {
      console.log('数据写入失败', event)
    }
  })
  transaction.oncomplete = () => {
    console.log('事务完成')
  }
  transaction.onerror = () => {
    console.log('事务失败')
  }
}

const getData = () => {
  if (!db.value) return message.warning('数据库未打开')
  const transaction = db.value.transaction(['objectStore'], 'readwrite')
  const objectStore = transaction.objectStore('objectStore')
  const request = objectStore.getAll()
  request.onerror = (event) => {
    console.log('事务失败')
  }
  request.onsuccess = (event) => {
    console.log('主键查询结果: ', request.result)
    app.setTableData(request.result)
  }
}
const create = () => {
  openDb(dbName.value, 1)
}
const init = async () => {
  const data = {
    page: 1,
    pageSize: 10000
  }
  const res = await getTableData(data)
  dataSource.value = res.data.list
  
}
onMounted(() => {
  create()
  init()
})
</script>

<style lang="scss" scoped></style>
