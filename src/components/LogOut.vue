<template>
  <div class="user">
    <a-button type="link" @click="toggle">
      <fullscreen-outlined v-if="!isFullscreen" />  
      <fullscreen-exit-outlined v-else />
    </a-button>
    
    <img class="avatar" src="@/assets/imgs/rem.jpg" alt="" srcset="" />
    <a-dropdown>
      <div class="username">
        {{ username }}
        <DownOutlined />
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="logout"> <logout-outlined /> 登出 </a-menu-item>
          <a-menu-item> <edit-outlined /> 修改密码 </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
import { userStore } from '@/stores/user-stores'
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  LogoutOutlined,
  EditOutlined,
  DownOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const user = userStore()
const { username, logOut } = user
console.log('username',username)
const logout = () => {
  logOut()
  router.push('/login')
}
const { isFullscreen, toggle } = useFullscreen()
</script>

<style lang="scss" scoped>
.user{
    display: flex;
    align-items: center;
}
.avatar {
  width: 40px;
  height: 40px;
  margin: 0 10px 0 10px;
}
</style>
