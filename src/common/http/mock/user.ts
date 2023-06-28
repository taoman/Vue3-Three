import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/login',
    method: 'post',
    response: ({ body }: any) => {
      console.log('body', body)
      return {
        message: '请求成功',
        code:200,
        data: {
          username: 'admin',
          // 一个用户可能有多个角色
          roles: ['admin'],
          accessToken: 'eyJhbGciOiJIUzUxMiJ9.admin',
          refreshToken: 'eyJhbGciOiJIUzUxMiJ9.adminRefresh',
          expires: '2023/10/30 00:00:00'
        }
      }
      // if (body.username === 'admin') {
      //   return {
      //     message: true,
      //     code:200,
      //     data: {
      //       username: 'admin',
      //       // 一个用户可能有多个角色
      //       roles: ['admin'],
      //       accessToken: 'eyJhbGciOiJIUzUxMiJ9.admin',
      //       refreshToken: 'eyJhbGciOiJIUzUxMiJ9.adminRefresh',
      //       expires: '2023/10/30 00:00:00'
      //     }
      //   }
      // } else {
      //   return {
      //     message: ‘请求成功,
      //     code:200,
      //     data: {
      //       username: 'common',
      //       // 一个用户可能有多个角色
      //       roles: ['common'],
      //       accessToken: 'eyJhbGciOiJIUzUxMiJ9.common',
      //       refreshToken: 'eyJhbGciOiJIUzUxMiJ9.commonRefresh',
      //       expires: '2023/10/30 00:00:00'
      //     }
      //   }
      // }
    }
  }
] as MockMethod[]
