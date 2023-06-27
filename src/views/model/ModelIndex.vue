<template>
  <div ref="statsRef" class="stats-panel"></div>
  <div ref="container" class="base-turbine">
    <div class="base-turbine-left">
      <div class="map-panels">
        <component :is="Witgets[item]" v-for="item in chunkModules.left" :key="item"></component>
      </div>
    </div>
    <div class="base-turbine-right">
      <div class="map-panels">
        <component :is="Witgets[item]" v-for="item in chunkModules.right" :key="item"></component>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <loading-outlined />
      <span>加载中,请耐心等待...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LoadingOutlined } from '@ant-design/icons-vue'
import { useTurbine } from './modelBase'
import { appModelStore } from '@/stores/model-stores'
import Witgets from './witgets'
import { storeToRefs } from 'pinia'
const { chunkModules } = storeToRefs(appModelStore())
const { loading,container, statsRef } = useTurbine()
</script>

<style lang="scss" scoped>
.base-turbine {
  width: 100vw;
  height: 100vh;
  background: #000;
  background-image: linear-gradient(90deg, #01355059 1px, transparent 1px),
    linear-gradient(0deg, #01355059 1px, transparent 1px);
  background-size: 30px 30px, 30px 30px;
  .base-turbine-left,
  .base-turbine-right {
    width: 373px;
    position: absolute;
    top: 70px;
    z-index: 999;
    display: flex;
    grid-gap: 10px;
    height: calc(100% - 90px);
    transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
    color: #fff;
    &.base-turbine-left {
      left: 10px;
    }

    &.base-turbine-right {
      right: 10px;
    }

    .map-panels {
      display: grid;
      grid-template-rows: repeat(3, 1fr);
      grid-gap: 10px;
      height: 100%;
      overflow: hidden;
    }
  }

  .map-controls {
    display: flex;
    flex-direction: column;
    grid-gap: 10px;
  }

  .loading {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 20px;
    color: #fff;

    .icon {
      margin-bottom: 10px;
      font-size: 26px;
    }
  }
}
.stats-panel {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
