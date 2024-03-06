<template>
  <div class="title">
    {{ target === 'offer' ? '发起方' : '接收方' }}
  </div>
  <div class="btn">
    <a-button type="primary" v-if="target === 'offer'" @click="startLive()">开始通话</a-button>
    <a-button type="primary" danger @click="endLive()">挂断通话</a-button>
  </div>
  <div class="container">
    <div class="video-box">
      <video id="remote-video" ref="remoteVideo" autoplay playsinline></video>
      <video id="local-video" ref="localVideo" autoplay muted></video>
    </div>
    <div class="logger">
      <div v-for="item in msgArr" :key="item">{{ item }}</div>
    </div>
  </div>
  <a-modal v-model:visible="visible" title="确认接听吗？" @ok="handleOk"> </a-modal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
const remoteVideo = ref()
const localVideo = ref()
const target = sessionStorage.jumpVideoParams
// const socket = new WebSocket('ws://localhost:8083')
const socket = new WebSocket('wss://liquanquan.top/websocket')
const peer = new RTCPeerConnection()
const msgArr = ref<string[]>([])
const visible = ref<boolean>(false)
const callStarted = ref<boolean>(false)
const message = {
  log(msg: string) {
    msgArr.value.push(msg)
  },
  error(msg: string) {
    msgArr.value.push(msg)
  }
}
const init = () => {
  localVideo.value.onloadeddata = () => {
    message.log('播放本地视频')
    localVideo.value.play()
  }
  remoteVideo.value.onloadeddata = () => {
    message.log('播放对方视频')
    remoteVideo.value.play()
  }
  socket.onopen = () => {
    message.log('信令通道创建成功')
  }
  socket.onerror = () => {
    message.error('信令通道创建失败！')
  }
  socket.onmessage = (e) => {
    const { type, sdp, iceCandidate } = JSON.parse(e.data)
    if (type === 'hangup') {
      endLive()
    }
    if (type === 'answer') {
      peer.setRemoteDescription(new RTCSessionDescription({ type, sdp }))
    } else if (type === 'answer_ice') {
      peer.addIceCandidate(iceCandidate)
    } else if (type === 'offer') {
      startLive(new RTCSessionDescription({ type, sdp }))
    } else if (type === 'offer_ice') {
      peer.addIceCandidate(iceCandidate)
    }
  }

  peer.ontrack = (e) => {
    if (e && e.streams) {
      message.log('收到对方音频/视频流数据...')
      remoteVideo.value.srcObject = e.streams[0]
    }
  }
  peer.onicecandidate = (e) => {
    if (e.candidate) {
      message.log('搜集并发送候选人')
      socket.send(
        JSON.stringify({
          type: `${target}_ice`,
          iceCandidate: e.candidate
        })
      )
    } else {
      message.log('候选人收集完成！')
    }
  }
}

const startLive = async (offerSdp?: any) => {
  if (target === 'offer') {
    await startCall(offerSdp)
  } else {
    visible.value = true
  }
}
const startCall = async (offerSdp?: any) => {
  let stream: any
  try {
    if (!callStarted.value) {
      message.log('尝试调取本地摄像头/麦克风')
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      message.log('摄像头/麦克风获取成功！')
      localVideo.value.srcObject = stream
      stream.getTracks().forEach((track: any) => peer.addTrack(track, stream))
      callStarted.value = true
    }
  } catch {
    message.error('摄像头/麦克风获取失败！')
    return
  }
  if (!offerSdp) {
    message.log('创建本地SDP')
    const offer = await peer.createOffer()
    await peer.setLocalDescription(offer)
    message.log(`传输发起方本地SDP`)
    socket.send(JSON.stringify(offer))
  } else {
    message.log('接收到发送方SDP')
    await peer.setRemoteDescription(offerSdp)
    message.log('创建接收方（应答）SDP')
    const answer = await peer.createAnswer()
    message.log(`传输接收方（应答）SDP`)
    socket.send(JSON.stringify(answer))
    await peer.setLocalDescription(answer)
  }
}
const handleOk = () => {
  startCall()
  visible.value = false
}
const endLive = () => {
  if (localVideo.value.srcObject) {
    localVideo.value.srcObject.getTracks().forEach((track: any) => track.stop())
  }
  if (remoteVideo.value.srcObject) {
    remoteVideo.value.srcObject.getTracks().forEach((track: any) => track.stop())
  }
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'hangup' }))
    socket.close()
  }
  msgArr.value = []
  callStarted.value = false
}
onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.title{
text-align: center;
font-size: 18px;
color: #4fbf40;
}
.container {
  width: 100%;
  display: flex;
  display: -webkit-flex;
  justify-content: space-around;
  padding-top: 20px;
}
.btn {
  display: flex;
  button {
    margin-right: 40px;
  }
}
.video-box {
  position: relative;
  width: 800px;
  height: 400px;
}
#remote-video {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border: 1px solid #eee;
  background-color: #f2f6fc;
}
#local-video {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 240px;
  height: 120px;
  object-fit: cover;
  border: 1px solid #eee;
  background-color: #ebeef5;
}
.logger {
  width: 40%;
  padding: 14px;
  line-height: 1.5;
  color: #4fbf40;
  border-radius: 6px;
  background-color: #272727;
}
.logger .error {
  color: #dd4a68;
}
</style>
