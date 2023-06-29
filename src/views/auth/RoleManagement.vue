<template>
  <div>
    <div>
     <div class="name">当前角色：{{ username }}</div></div> 
    <a-select
      v-model:value="username"
      :options="options"
      placeholder="Please select"
      style="width: 200px"
    />
  </div>
</template>

<script setup lang="ts">
import { userStore } from '@/stores/user-stores'
import { ref } from 'vue'
const user = userStore()
const username = ref(user.username)
const options = [
  {
    value: 'admin',
    label: '管理员角色'
  },
  {
    value: 'common',
    label: '普通角色'
  }

]
</script>

<style lang="scss" scoped>
.name{
  margin-bottom: 20px;
}
</style>
