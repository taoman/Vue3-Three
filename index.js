import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8083 })
wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    wss.clients.forEach((client) => {
      client.send(data.toString())
      // if (client !== ws && client.readyState === WebSocket.OPEN) {
      //   client.send(data.toString())
      // }
    })
  })
  ws.on('open', () => {
    console.log('客户端已连接')
  })
  ws.on('close', () => {
    console.log('客户端已关闭连接')
  })
  ws.onerror = () => {
    console.log('连接异常')
  }
})
