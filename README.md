# vue3_vite

This template should help get you started developing with Vue 3 in Vite.
线上地址:liquanquan.top/vue-admin
## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

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