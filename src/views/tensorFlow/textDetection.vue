<template>
  <div class="content">
    <div>
      <a-button type="primary" @click="getImg">随机获取一张图片</a-button>
    </div>
    <img style="width: 100px; height: 100px; margin: 20px 0" id="img" :src="imgUrl" />
    <div>
      <a-button type="primary" @click="predict" :loading="loading">识别</a-button>
    </div>
    <div style="margin-top: 20px">
      <h2>识别结果：</h2>
      <div v-for="item in text" :key="item.className" class="item">
        名称：{{ item.className }}：概率：{{ item.probability }}
      </div>
    </div>
  </div>
  <div>
    {{ chat }}
  </div>
  <a-button type="primary" @click="submit">请求</a-button>
</template>

<script setup lang="ts">
// import * as tf from '@tensorflow/tfjs'
// import * as MobileNet from '@tensorflow-models/mobilenet'
// import * as wasm from '@tensorflow/tfjs-backend-wasm'
import random0 from '@/assets/imgs/randomImgs/random0.jpg'
import random1 from '@/assets/imgs/randomImgs/random1.jpg'
import random2 from '@/assets/imgs/randomImgs/random2.jpg'
import random3 from '@/assets/imgs/randomImgs/random3.jpg'
import random4 from '@/assets/imgs/randomImgs/random4.jpg'
import random5 from '@/assets/imgs/randomImgs/random5.jpg'
import { onMounted, ref } from 'vue'
import BestRequest from 'best-request'
const randomIndex = ref(0)
const imgs = [random0, random1, random2, random3, random4, random5]
const imgUrl = ref()
const loading = ref(false)
const text = ref()
const chat = ref('')
const getImg = () => {
  randomIndex.value = Math.floor(Math.random() * 6)
  imgUrl.value = imgs[randomIndex.value]
}
const predict = () => {
  // init(document.getElementById('img'))
}
// const init = async (img: any) => {
//   loading.value = true
//   tf.setBackend('cpu')
//   const model = await MobileNet.load()
//   const predictions = await model.classify(img, 5)
//   if (predictions) {
//     loading.value = false
//     text.value = predictions.map((item) => {
//       return {
//         ...item,
//         probability: Math.round(item.probability * 100) + '%'
//       }
//     })
//     console.log('text.value', text.value)
//   }
// }

const submit = async () => {
  const config = {
    baseURL: 'https://gw.test.bestpay.net/open/1.0/workorder/BizOrderDashboardService',
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVUaW1lIjoxNzI3NDAyODYxLCJ0ZW5hbnRJZCI6IjEyMyIsInVzZXJOYW1lIjoiZ3VhbmxpeXVhbjEiLCJqdGkiOiIxOTY0MWRkMi1mYjE0LTQ1MTYtYThkMS1iODJhYWViOWMxZmYifQ.UcLhkiUaVmLh5lSPCoGnH0cWJnm3UdsR0Fvhmo40B1E',
    tenantId: '0',

    env: {
      yzfPublicKey:
        'MFkwEwYHKoZIzj0CAQYIKoEcz1UBgi0DQgAES3jbgMoQYSD5muAXdn32ymyAC0SBFOCf7KylQliTbz0kEkXCLo7aJ6dRmnId3r3QZRJbc/21o2A51RKm/Z8H3g==',
      certificateSerial: 'SK59734264476f4636b2bcbd03a56f193b',
      app_id: '980010000118002',
      env: 'SIT_2024092601',
      sessionKey: ''
    }
  }
  const url = '/orderTypeStaticsGraph'
  const res = await BestRequest.requestBridge({
    url,
    ...config,
    data: {
      startTime: '2024-06-27',
      endTime: '2024-09-26'
    }
  })
  console.log('res', res)
  // const data = {
  //   api: {
  //     dome: 2,
  //     name: 'doTtsWithCache',
  //     operationType: 'com.bestpay.cs.msgpusher.api.DigitalHumanService#doTtsWithCache'
  //   },
  //   params: {
  //     messages: [
  //       {
  //         text: '<div>3&lt;MarkTwo&gt;123&lt;/MarkTwo&gt;</div>',
  //         textStyle: 'RICH_TXT'
  //       },
  //       {
  //         text: '<div>123<a title="2222" href="0">232323</a></div>',
  //         textStyle: 'RICH_TXT'
  //       }
  //     ]
  //   },
  //   option: {
  //     headers: {
  //       authSsuCode: '8901010699000060',
  //       authorization:
  //         'H5:831340eed84c6006171f716f3f1285006acc40221fdf248dc59fe79103820b6c9f307bf21d8898a396511995b35aaf1558f62bed5e55c38edc53cc42cfe44fd4c81dc6052d14b614b80a2fad04e8ebc3100a6a51cea7e6a815e3e7fb08b179c197642b8fca6102be9c7a6a4a4cab5161',
  //       'event-context': {
  //         ipTId: '890120060000039060403300',
  //         tntId: '0101',
  //         ipRId: '890110060000034390403302',
  //         env: 'DEV_XQYFGL66486'
  //       },
  //       sessionKey: '19c87793113c564551c0d3b6b705f2f4'
  //     }
  //   },
  //   baseParams: {
  //     // requestEnv:'prod',
  //     appType: '60'
  //   }
  // }
  // const res = await BestRequest.requestMgs({...data})
}
onMounted(() => {
  //   init()
})
</script>

<style lang="scss" scoped>
.content {
  // display: flex;
  // flex-direction: column;
}
.item {
  font-size: 16px;
  margin-bottom: 10px;
}
</style>
