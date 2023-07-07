import { defineStore } from 'pinia'
import { login } from '@/api/user'
import { permissionStore } from '@/stores/permission-stores'

interface UserType {
  username: string
  roles?: Array<string>
}
export interface DataInfo<T> {
  /** token */
  accessToken: string
  /** `accessToken`的过期时间（时间戳） */
  expires: string
  /** 用于调用刷新accessToken的接口时所需的token */
  refreshToken: string
  /** 用户名 */
  username: string
  /** 当前登陆用户的角色 */
  roles?: Array<string>
}
export const userStore = defineStore('user-store', {
  state: (): UserType => ({
    username: sessionStorage.username ?? '',
    roles: sessionStorage.roles ?? []
  }),

  actions: {

    SET_TOKEN<T extends DataInfo<T>>(data: T) {
      const { accessToken, expires, refreshToken, roles, username } = data
      console.log('roles',roles)
      sessionStorage.accessToken = accessToken
      sessionStorage.expires = expires
      sessionStorage.refreshToken = refreshToken
      sessionStorage.username = username
      sessionStorage.roles = roles
      this.username = username
    },
    async login(data: { username: string; password: string }) {
      const res = await login(data)
      this.SET_TOKEN(res.data)
      return res
    },
    logOut() {
      sessionStorage.clear()
    }
  }
})
