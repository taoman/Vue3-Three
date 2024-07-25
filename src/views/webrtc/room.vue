<template>
  <div class="room">
    <div class="left">
      <div v-for="(item, index) in userList" :key="index" class="user" @click="selectUser(item)">
        {{ item.name }}
      </div>
    </div>
    <div class="right">
      <a-button type="primary" @click="leaveRoom">离开</a-button>

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
        <!-- <video v-if="selectedUserVideo" ref="mainVideo" autoplay /> -->
        {{ selectedUser }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
const router = useRouter()
const routeQuery = route.query as unknown as RouteQuery
const roomName = ref(routeQuery.roomName)
const userName = ref(routeQuery.userName)
const socket = io('http://localhost:3003')

const userList = ref<User[]>([])
const videoList = ref<{ user: User; stream: MediaStream }[]>([])
const selectedUser = ref<User | null>(null)
const selectedUserVideo = ref<MediaStream | null | undefined>(null)
const videoRefs = ref<(HTMLVideoElement | null)[]>([])
const peerConnections: { [id: string]: RTCPeerConnection } = {}
const mainVideo = ref<HTMLVideoElement | null>(null)
const iceCandidateQueue: { [id: string]: RTCIceCandidate[] } = {}

const init = async () => {
  console.log('socket', socket)
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
  console.log('当前用户', users)
  for (const user of users) {
    if (user.userId && user.userId !== socket.id) {
      const newUser: User = { name: user.userName, id: user.userId }
      userList.value.push(newUser)
      console.log(`为用户创建对等连接 ${user.userId}`)

      const peerConnection = createPeerConnection(user.userId)
      peerConnections[user.userId] = peerConnection

      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)
      socket.emit('offer', { roomName: roomName.value, offer, targetId: user.userId })
    }
  }
}

const handleUserJoined = async ({ userId, userName }: any) => {
  console.log(`用户加入 ${userName} (${userId})`)
  const peerConnection = createPeerConnection(userId)
  peerConnections[userId] = peerConnection
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  socket.emit('offer', { roomName: routeQuery.roomName, offer, targetId: userId })

  const newUser: User = { name: userName, id: userId }
  userList.value.push(newUser)
}

const handleOffer = async ({ offer, from }: any) => {
  console.log(`收到offer ${from}`)
  const peerConnection = peerConnections[from] || createPeerConnection(from)
  peerConnections[from] = peerConnection

  if (peerConnection.signalingState !== 'stable') {
    await new Promise((resolve) => {
      peerConnection.onnegotiationneeded = resolve
    })
  }

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
  const answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)
  socket.emit('answer', { roomName: roomName.value, answer, targetId: from })
  if (iceCandidateQueue[from]) {
    for (const candidate of iceCandidateQueue[from]) {
      await peerConnection.addIceCandidate(candidate)
    }
    delete iceCandidateQueue[from]
  }
}

const handleAnswer = async ({ answer, from }: any) => {
  console.log(`收到应答 ${from}`)
  const peerConnection = peerConnections[from]
  if (peerConnection.signalingState === 'have-local-offer') {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
  }
}

const handleIceCandidate = async ({ candidate, from }: any) => {
  console.log(`收集候选人 ${from}`)
  const peerConnection = peerConnections[from]
  if (peerConnection && peerConnection.remoteDescription) {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  } else {
    if (!iceCandidateQueue[from]) {
      iceCandidateQueue[from] = []
    }
    iceCandidateQueue[from].push(new RTCIceCandidate(candidate))
  }
}

const handleUserLeft = ({ userId }: any) => {
  console.log(`用户离开 ${userId}`)
  const index = userList.value.findIndex((user) => user.id === userId)
  if (index !== -1) {
    userList.value.splice(index, 1)
  }

  if (peerConnections[userId]) {
    peerConnections[userId].close()
    delete peerConnections[userId]
  }
  videoList.value = videoList.value.filter((video) => video.user.id !== userId)
}

const createPeerConnection = (userId: string) => {
  console.log(`创建连接 ${userId}`)

  const peerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302'
      }
    ]
  })

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log(`发送候选人信息 ${userId}`)
      socket.emit('ice-candidate', {
        roomName: roomName.value,
        candidate: event.candidate,
        targetId: userId
      })
    }
  }

  peerConnection.ontrack = (event) => {
    console.log(`收到远程track ${userId}`)
    const stream = event.streams[0]
    const user = userList.value.find((item) => item.id === userId)
    if (user && !user.stream) {
      user.stream = stream
      videoList.value.push({ user, stream })
      console.log('videoList', videoList.value)
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
const leaveRoom = () => {
  // socket.emit('leaveRoom', { userId: socket.id, roomName: roomName.value })
  // handleUserLeft({ userId: socket.id })
  // socket.disconnect()
  for (const peerConnection of Object.values(peerConnections)) {
    peerConnection.close()
  }
  
  // Stop local media tracks
  const localUser = userList.value.find(user => user.id === socket.id)
  if (localUser?.stream) {
    localUser.stream.getTracks().forEach(track => track.stop())
  }
  
  // Notify the server
  socket.emit('leaveRoom', { userId: socket.id, roomName: roomName.value })
  
  // Remove local video element
  videoList.value = videoList.value.filter(video => video.user.id !== socket.id)
  
  // Clean up user list and selected user
  userList.value = userList.value.filter(user => user.id !== socket.id)
  selectedUser.value = null
  selectedUserVideo.value = null
  router.back()
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
