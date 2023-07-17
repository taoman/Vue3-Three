import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import ViteImages from 'vite-plugin-vue-images'
import { viteMockServe } from 'vite-plugin-mock'
import {createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// https://vitejs.dev/config/
const base = process.env.NODE_ENV === 'production' ? '/vue-admin/' : '/'
export default defineConfig({
  base,
  define:{

  },
  server:{
    proxy:{
      '^/newsApi':{
        target:'https://way.jd.com',
        changeOrigin:true,
        rewrite: path => path.replace(/^\/newsApi/, '')
      },
    }
  },
  build: {
    outDir: 'docs'
  },
  plugins: [
    vue(),
    VueSetupExtend(),
    createSvgIconsPlugin({
      iconDirs: [fileURLToPath(new URL('./src/assets/imgs/login', import.meta.url))],
      symbolId: 'icon-[dir]-[name]'
    }),
    viteMockServe({
      mockPath: './src/common/http/mock',
      localEnabled: true
    }),
    Components({
      resolvers: [AntDesignVueResolver()]
    }),
    ViteImages({
      dirs: ['src/assets/images']
    })
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/index.scss";`
      }
    }
  }
})
