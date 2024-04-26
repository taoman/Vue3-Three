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
</template>

<script setup lang="ts">
import * as tf from '@tensorflow/tfjs'
import * as MobileNet from '@tensorflow-models/mobilenet'
// import * as wasm from '@tensorflow/tfjs-backend-wasm'
import random0 from '@/assets/imgs/randomImgs/random0.jpg'
import random1 from '@/assets/imgs/randomImgs/random1.jpg'
import random2 from '@/assets/imgs/randomImgs/random2.jpg'
import random3 from '@/assets/imgs/randomImgs/random3.jpg'
import random4 from '@/assets/imgs/randomImgs/random4.jpg'
import random5 from '@/assets/imgs/randomImgs/random5.jpg'
import { onMounted, ref } from 'vue'
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
  init(document.getElementById('img'))
}
const init = async (img: any) => {
  loading.value = true
  tf.setBackend('cpu')
  const model = await MobileNet.load()
  const predictions = await model.classify(img, 5)
  if (predictions) {
    loading.value = false
    text.value = predictions.map((item) => {
      return {
        ...item,
        probability: Math.round(item.probability * 100) + '%'
      }
    })
    console.log('text.value', text.value)
  }
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
