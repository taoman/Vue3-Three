<template>
  <div>
    <div>
      <div class="name">当前角色：{{ username }}</div>
    </div>
    <a-select
      v-model:value="username"
      :options="options"
      placeholder="Please select"
      style="width: 200px"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { userStore } from '@/stores/user-stores'
import { ref } from 'vue'
import type { SelectProps } from 'ant-design-vue'
const user = userStore()
const username = ref(user.username)
const options = ref<SelectProps['options']>([
  {
    value: 'admin',
    label: '管理员角色'
  },
  {
    value: 'common',
    label: '普通角色'
  }
])
const handleChange = (e: any) => {
  console.log('value', e)
}
</script>

<style lang="scss" scoped>
.name {
  margin-bottom: 20px;
}
</style>
