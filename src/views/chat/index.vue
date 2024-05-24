<template>
  <a-row style="margin-top: 100px">
    <a-col :span="8" :offset="6"
      ><div class="chat">
        <div class="message">
          <div class="title">聊天内容</div>
          <div class="msgItem" v-for="item in msgLists" :key="item.time">
            <div class="time">{{ item.time }}</div>
            <div class="data">{{ item.data }}</div>
          </div>
        </div>
        <div class="send">
          <a-textarea
            style="height: 60px"
            v-model:value="value"
            placeholder="输入发送内容"
            allow-clear
            @pressEnter="send"
          />
          <div class="fot">
            <div>
              <a-select
                ref="select"
                v-model:value="selectValue"
                style="width: 150px"
                placeholder="选择聊天方式"
                @change="handleChange"
              >
                <a-select-option value="1">websocket</a-select-option>
                <a-select-option value="2">sse</a-select-option>
              </a-select>
            </div>
            <a-button class="btn" type="primary" @click="send">发送</a-button>
          </div>
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
import { onMounted, ref } from 'vue'
import { chat } from '@/api/chat'
const socketRef = ref()
const sseRef = ref()
// const socket = new WebSocket('ws://localhost:8080')
const msgArr = ref<string[]>([])
const msgLists = ref<{ time: string; data: string }[]>([])
const value = ref<string>('')
const selectValue = ref()
const message = {
  log(msg: string) {
    msgArr.value.push(msg)
  },
  error(msg: string) {
    msgArr.value.push(msg)
  }
}
const init = () => {
  socketRef.value = new WebSocket('wss://liquanquan.top/websocket')
  // socketRef.value = new WebSocket('ws://localhost:8083')
  socketRef.value.onopen = () => {
    message.log('websocket连接成功')
  }
  socketRef.value.onerror = () => {
    message.error('websocket连接失败！')
  }
  socketRef.value.onmessage = (e:any) => {
    message.log('来消息了')
    const time = new Date().toLocaleString()
    msgLists.value.push({ time, data: e.data })
  }
}
const sseInit = () => {
  sseRef.value = new EventSource('http://localhost:3002/api/sse')
  sseRef.value.onmessage = (e:any) => {
    const data = e.data && JSON.parse(e.data)
    if (data.data == 'end') {
      sseRef.value.close()
      isEnd.value = true
    } else {
      // msgLists.value.push({ time: new Date().toLocaleString(), data: data })
      renderMessage(data.data)
    }
  }
}
const chatInit = async () => {
  const data = {
    message: value.value
  }
  const res = await chat(data)
  if (res.code == 200) {
    sseInit()
  }
}
const send = () => {
  if (selectValue.value == '1') {
    socketRef.value.send(value.value)
  } else {
    chatInit()
  }
  value.value = ''
}

const isEnd = ref(true)


const renderMessage = (message: string) => {
  const timestamp = new Date().toLocaleString()
  if (isEnd.value) {
    // 如果接收到了完整的消息，添加一条新的消息
    msgLists.value.push({ time: timestamp, data: message })
    isEnd.value = false // 改变 isEnd 的状态
  } else {
    const index = msgLists.value.length - 1
    msgLists.value[index].data += message
  }
}
const handleChange = () => {
  if (selectValue.value == '1') {
    init()
  } else {
    message.log('sse连接成功')
  }
}

onMounted(() => {
  // init()
  // sseInit()
})
</script>

<style lang="scss" scoped>
.chat {
  height: 500px;
  border: 1px solid #ccc;
  background: #eee;
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
      margin-top: 20px;
      .time {
        color: #272727;
      }
      .data {
        margin-top: 5px;
        color: green;
      }
    }
  }
  .send {
    width: 100%;
    height: 100px;
    // border: 1px solid red;
    position: relative;
    .fot {
      position: absolute;
      bottom: 0;
      right: 0;
      display: flex;
      align-items: center;
      .btn {
        margin-left: 20px;
      }
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
