<template>
  <a-row style="margin-top: 100px">
    <a-col :span="8" :offset="6"
      ><div class="chat">
        <div class="message">
          <div class="title">聊天内容</div>
          <div class="msgItem" v-for="item in msgLists" :key="item">{{ item }}</div>
        </div>
        <div class="send">
          <a-textarea
            style="height: 60px"
            v-model:value="value"
            placeholder="输入发送内容"
            allow-clear
          />
          <a-button class="btn" type="primary" @click="send">发送</a-button>
        </div>
      </div>
    </a-col>
    <a-col :span="4" :offset="1"
      ><div class="logger">
        <div v-for="item in msgArr" :key="item">{{ item }}</div>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { on } from 'events'
import { onMounted, ref } from 'vue'

// const socket = new WebSocket('wss://liquanquan.top/websocket')
const socket = new WebSocket('ws://localhost:8080')
const msgArr = ref<string[]>([])
const msgLists = ref<string[]>([])
const value = ref<string>('')
const message = {
  log(msg: string) {
    msgArr.value.push(msg)
  },
  error(msg: string) {
    msgArr.value.push(msg)
  }
}
const init = () => {
  socket.onopen = () => {
    message.log('websocket连接成功')
  }
  socket.onerror = () => {
    message.error('websocket连接失败！')
  }
  socket.onmessage = (e) => {
    message.log('来消息了')
    msgLists.value.push(e.data)
  }
}

const send = () => {
  socket.send(value.value)
}
onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.chat {
  height: 500px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  padding: 10px;
  .message {
    flex: 1;
    overflow: auto;
    .title {
      width: 100%;
      margin: auto;
      text-align: center;
    }
    .msgItem {
      height: 30px;
      line-height: 30px;
      margin-top: 5px;
      color: skyblue;
    }
  }
  .send {
    width: 100%;
    height: 100px;
    // border: 1px solid red;
    position: relative;
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
}
.logger {
  height: 500px;
  padding: 14px;
  line-height: 1.5;
  color: #4fbf40;
  border-radius: 6px;
  background-color: #272727;
}
</style>
