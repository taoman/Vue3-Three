<template>
  <div class="login">
    <div class="left">
      <svg-icon class-name="ill-class" icon-class="illustration" />
    </div>
    <div class="right">
      <div
        class="content"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { delay }
        }"
      >
        <svg-icon class-name="avatar" icon-class="avatar" />
        <h2>VUE-ADMIN</h2>
        <a-form
          :model="formState"
          name="normal_login"
          class="login-form"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <a-form-item name="username" :rules="[{ required: true, message: '请输入账号!' }]">
            <a-input v-model:value="formState.username" placeholder="账号" allowClear>
              <template #prefix>
                <UserOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item name="password" :rules="[{ required: true, message: '请输入密码!' }]">
            <a-input-password v-model:value="formState.password" placeholder="密码" allowClear>
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item>
            <a-form-item name="remember" no-style>
              <a-checkbox v-model:checked="formState.remember">记住密码</a-checkbox>
            </a-form-item>
            <a class="login-form-forgot" href="">忘记密码</a>
          </a-form-item>

          <a-form-item>
            <a-button
              :disabled="disabled"
              :loading="loading"
              type="primary"
              html-type="submit"
              class="login-form-button"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { userStore } from '@/stores/user-stores'
import { initRouter } from '@/router/utils'
interface FormState {
  username: string
  password: string
  remember: boolean
}
const loading = ref(false)
const formState = reactive<FormState>({
  username: 'admin',
  password: '123456',
  remember: true
})
const delay = 200
const router = useRouter()
const user = userStore()
const onFinish = async (values: any) => {
  loading.value = true
  const res = await user.login(values)
  if (res.code === 200) {
    initRouter().then(() => {
      router.push('/')
    })
    loading.value = false
  }
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
const disabled = computed(() => {
  return !(formState.username && formState.password)
})
</script>

<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  background: url('@/assets/imgs/login/bg.png') no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;

  .left,
  .right {
    width: 50%;
    height: 100%;
  }
  .left {
    display: flex;
    justify-content: center;
    align-items: center;
    .ill-class {
      width: 500px;
      height: 380px;
    }
  }
  .right {
    display: flex;
    justify-content: center;
    align-items: center;
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 360px;
      .avatar {
        width: 350px;
        height: 80px;
      }
      h2 {
        color: #aaa;
      }
      .ant-form {
        width: 100%;
        :deep(.ant-input) {
          height: 30px;
        }
        :deep(.ant-form-item-control-input-content) {
          display: flex;
          justify-content: space-between;
        }
        .ant-btn {
          width: 100%;
        }
      }
    }
  }
}
</style>
@/api/user
