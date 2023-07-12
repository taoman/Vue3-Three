<template>
  <div>
    <div class="tip">模拟后台根据不同角色返回对应路由，切换角色时注意观察左侧菜单栏，管理员可查看系统管理，普通角色无权限查看</div>
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
import {usePermissionStoreHook}  from '@/stores/permission-stores'
import {initRouter} from '@/router/utils'
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
const handleChange =async () => {
  const data = {
    username:username.value,
    password:'123456'
  }
  const res = await user.login(data)
  if(res.code === 200){
    sessionStorage.removeItem('asyncRoutes')
    usePermissionStoreHook().clearAllCachePage()
    initRouter()
  }
  
}
</script>

<style lang="scss" scoped>
.name {
  margin-bottom: 20px;
}
.tip{
  background: #108ee9;
  color: #fff;
  padding: 2px 10px;
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 5px;
  margin-bottom: 20px;
}
</style>
