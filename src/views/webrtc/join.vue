<template>
  <div class="join">
    <div @click="createRoom">create</div>
    <div @click="joinRoom">join</div>
  </div>
  <app-modal
    :title="modalTitle"
    v-model:modalVisible="modalVisible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form v-bind="modalFormLayout" :model="state.formState">
      <a-form-item name="roomName" label="房间名称">
        <a-input v-model:value="state.formState.roomName" placeholder="输入房间名称" />
      </a-form-item>
      <a-form-item name="userName" label="昵称">
        <a-input v-model:value="state.formState.userName" placeholder="输入昵称" />
      </a-form-item>
    </a-form>
  </app-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
const modalVisible = ref(false)
const modalTitle = ref('')
const titleArr = ['创建房间', '加入房间']
const roomIndex = ref(0)
const router = useRouter()
const modalFormLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
}
const state = reactive<{ formState: { roomName: string; userName: string } }>({
  formState: {
    roomName: '',
    userName: ''
  }
})
const createRoom = () => {
  roomIndex.value = 0
  modalTitle.value = titleArr[roomIndex.value]
  modalVisible.value = true
}
const joinRoom = () => {
  roomIndex.value = 1
  modalTitle.value = titleArr[roomIndex.value]
  modalVisible.value = true
}
const handleOk = () => {
  modalVisible.value = false
  router.push({
    path: '/webrtc/room',
    query: {
      roomIndex: roomIndex.value,
      roomName: state.formState.roomName,
      userName: state.formState.userName
    }
  })
}
const handleCancel = () => {}
</script>

<style lang="scss" scoped>
.join {
  display: flex;

  div {
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
