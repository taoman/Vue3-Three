<template>
  <a-layout id="layout" v-if="!isModelFullScreen">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline"> </a-menu>
      <AppMenu />
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="layout-header">
        <div class="layout-header-bread">
          <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
          <app-bread-crumb />
        </div>
        <div class="logout">
          <log-out />
        </div>
      </a-layout-header>
      <app-tags />
      <a-layout-content
        class="layout-content"
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
        <AppMain />
      </a-layout-content>
    </a-layout>
  </a-layout>
  <div v-if="isModelFullScreen"><ModelOverLay /></div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import AppMain from './AppMain.vue'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import { useAppStoreHook } from '@/stores/app-stores'
import { storeToRefs } from 'pinia'
import ModelOverLay from '@/views/layout/ModelOverLay.vue'
const selectedKeys = ref<string[]>(['1'])
const collapsed = ref<boolean>(false)
const { isModelFullScreen } = storeToRefs(useAppStoreHook())
</script>
<style lang="scss" scoped>
#layout {
  width: 100vw;
  height: 100vh;
  .layout-header {
    background: #fff;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    &-bread {
      flex: 1;
      display: flex;
      align-items: center;
    }
  }
  .logout {
    margin-right: 20px;
  }
  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }

  .trigger:hover {
    color: #1890ff;
  }

  .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    margin: 16px;
  }

  .site-layout .site-layout-background {
    background: #fff;
  }
  .layout-content {
    padding: 24px;
    background: #fff;
    min-height: 280px;
    overflow: auto;
  }
}
</style>
