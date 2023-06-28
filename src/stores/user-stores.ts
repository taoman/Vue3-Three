import { defineStore } from 'pinia'
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
  username?: string
  /** 当前登陆用户的角色 */
  roles?: Array<string>
}
export const userStore = defineStore('user-store', {
  state: (): UserType => ({
    username: sessionStorage.username ?? '',
    roles: sessionStorage.roles ?? []
  }),

  actions: {
    // SET_USERNAME(username: string) {
    //   this.username = username
    //   sessionStorage.username = username
    // },
    // SET_ROLES(roles: Array<string>) {
    //   this.roles = roles
    //   sessionStorage.roles = roles
    // },
    SET_TOKEN<T extends DataInfo<T>>(data: T) {
      const { accessToken, expires, refreshToken, roles, username } = data
      sessionStorage.accessToken = accessToken
      sessionStorage.expires = expires
      sessionStorage.refreshToken = refreshToken
      sessionStorage.username = username
      sessionStorage.roles = roles
    }
  }
})
