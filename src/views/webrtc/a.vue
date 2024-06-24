<template>
  <div class="room">
    <div class="left">
      <div 
        v-for="(item, index) in userList" 
        :key="index" 
        class="user" 
        @click="selectUser(item)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="right">
      <div class="videos">
        <video
          v-for="(video, index) in videoList"
          :key="index"
          ref="videoRefs"
          autoplay
          :class="{ selected: selectedUser === video.user }"
          @click="selectUser(video.user)"
        />
      </div>
      <div class="main-video">
        <video v-if="selectedUserVideo" ref="mainVideo" autoplay />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { io } from 'socket.io-client'

interface RouteQuery {
  roomIndex: number
  roomName: string
  userName: string
}

interface User {
  name: string
  id?: string
  stream?: MediaStream
}

const route = useRoute()
const routeQuery = route.query as unknown as RouteQuery
const roomName = ref(routeQuery.roomName)
const userName = ref(routeQuery.userName)
const socket = io('http://localhost:3003')

const userList = ref<User[]>([])
const videoList = ref<{ user: User; stream: MediaStream }[]>([])
const selectedUser = ref<User | null>(null)
const selectedUserVideo = ref<MediaStream | null>(null)
const videoRefs = ref<(HTMLVideoElement | null)[]>([])
const peerConnections: { [id: string]: RTCPeerConnection } = {}
const mainVideo = ref<HTMLVideoElement | null>(null)

const init = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  })
  const currentUser: User = { name: userName.value, id: socket.id, stream }
  userList.value.push(currentUser)
  videoList.value.push({ user: currentUser, stream })

  if (videoList.value.length > 0) {
    selectedUser.value = videoList.value[0].user
    selectedUserVideo.value = videoList.value[0].stream
  }

  await nextTick()

  videoList.value.forEach((video, index) => {
    const videoElement = videoRefs.value[index]
    if (videoElement) {
      videoElement.srcObject = video.stream
    }
  })

  if (mainVideo.value && selectedUserVideo.value) {
    mainVideo.value.srcObject = selectedUserVideo.value
  }

  socket.emit(
    'joinRoom',
    JSON.stringify({
      userName: userName.value,
      roomName: roomName.value
    })
  )
  socket.on('currentUsers', handleCurrentUsers)
  socket.on('userJoined', handleUserJoined)
  socket.on('offer', handleOffer)
  socket.on('answer', handleAnswer)
  socket.on('ice-candidate', handleIceCandidate)
  socket.on('userLeft', handleUserLeft)
}

const handleCurrentUsers = async (users: any) => {
  for (const user of users) {
    if (user.id !== socket.id) {
      const newUser: User = { name: user.userName, id: user.id }
      userList.value.push(newUser)
      const peerConnection = createPeerConnection(user.id)
      peerConnections[user.id] = peerConnection
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)
      socket.emit('offer', { roomName: roomName.value, offer, targetId: user.id })
    }
  }
}

const handleUserJoined = async ({ userId, userName }: any) => {
  const newUser: User = { name: userName, id: userId }
  userList.value.push(newUser)
  const peerConnection = createPeerConnection(userId)
  peerConnections[userId] = peerConnection
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  socket.emit('offer', { roomName: routeQuery.roomName, offer, targetId: userId })
}

const handleOffer = async ({ offer, from }: any) => {
  const peerConnection = createPeerConnection(from)
  peerConnections[from] = peerConnection
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
  const answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)
  socket.emit('answer', { roomName: roomName.value, answer, targetId: from })
}

const handleAnswer = async ({ answer, from }: any) => {
  const peerConnection = peerConnections[from]
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
}

const handleIceCandidate = ({ candidate, from }: any) => {
  const peerConnection = peerConnections[from]
  peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
}

const handleUserLeft = ({ userId }: any) => {
  const index = userList.value.findIndex((user) => user.id === userId)
  if (index !== -1) {
    userList.value.splice(index, 1)
  }

  if (peerConnections[userId]) {
    peerConnections[userId].close()
    delete peerConnections[userId]
  }

  const videoIndex = videoList.value.findIndex((video) => video.user.id === userId)
  if (videoIndex !== -1) {
    videoList.value.splice(videoIndex, 1)
  }
}

const createPeerConnection = (userId: string) => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302'
      }
    ]
  })
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', {
        roomName: roomName.value,
        candidate: event.candidate,
        targetId: userId
      })
    }
  }
  peerConnection.ontrack = (event) => {
    const stream = event.streams[0]
    const user = userList.value.find((item) => item.id === userId)
    if (user && !user.stream) { // 只在stream为空时添加新的stream
      user.stream = stream
      videoList.value.push({ user, stream })

      nextTick(() => {
        videoList.value.forEach((video, index) => {
          const videoElement = videoRefs.value[index]
          if (videoElement) {
            videoElement.srcObject = video.stream
          }
        })
      })
    }
  }
  const currentUserStream = userList.value.find((user) => user.id === socket.id)?.stream
  if (currentUserStream) {
    currentUserStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, currentUserStream)
    })
  }
  return peerConnection
}

const selectUser = (user: User) => {
  selectedUser.value = user
  selectedUserVideo.value = user.stream

  if (mainVideo.value && selectedUserVideo.value) {
    mainVideo.value.srcObject = selectedUserVideo.value
  }
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.room {
  width: 100vw;
  height: 100vh;
  display: flex;
  border: 1px solid #ccc;
  .left {
    width: 256px;
    padding: 10px;
    box-sizing: border-box;
    border-right: 1px solid #000;
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .user {
      width: 100%;
      height: 200px;
      border: 1px solid #ccc;
      text-align: center;
      margin-bottom: 10px;
    }
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .videos {
      display: flex;
      flex-wrap: wrap;
    }
    video {
      width: 200px;
      height: 150px;
      margin: 5px;
    }
    .main-video video {
      width: 100%;
      height: auto;
    }

    .selected {
      border: 2px solid red;
    }
  }
}
</style>

用户 A                                 用户 B                                 服务器
  |                                      |                                       |
  | 请求媒体流                           |                                       |
  |------------------------------------->| 请求媒体流                            |
  |                                      |-------------------------------------->|
  |                                      |                                       |
  | 连接到 Socket 服务器                  | 连接到 Socket 服务器                   |
  |------------------------------------->|-------------------------------------->|
  |                                      |                                       |
  | 发送 joinRoom 事件                    |                                       |
  |------------------------------------->|                                       |
  |                                      |                                       |
  | 接收用户列表                          |                                       |
  |<-------------------------------------|                                       |
  | 创建 PeerConnections 并发送 offer      |                                       |
  |------------------------------------->|                                       |
  |                                      |                                       |
  |                                      | 发送 joinRoom 事件                     |
  |                                      |-------------------------------------->|
  |                                      |                                       |
  |                                      | 接收用户列表                           |
  |                                      |<-------------------------------------|
  |                                      | 创建 PeerConnections 并发送 offer      |
  |                                      |-------------------------------------->|
  |                                      |                                       |
  | 接收 offer                            |                                       |
  |<-------------------------------------|                                       |
  | 发送 answer                           |                                       |
  |------------------------------------->|                                       |
  |                                      | 接收 answer                            |
  |                                      |<-------------------------------------|
  |                                      |                                       |
  | 接收 ICE 候选                          | 接收 ICE 候选                          |
  |<-------------------------------------|<-------------------------------------|
  | 发送 ICE 候选                          | 发送 ICE 候选                          |
  |------------------------------------->|-------------------------------------->|
  |                                      |                                       |
