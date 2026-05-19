import { defineStore } from 'pinia'
import { CookieStorage } from "@/utils/tools.js";

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: JSON.parse(sessionStorage.getItem('userInfo')) || {},
    token: CookieStorage.get('token') || sessionStorage.getItem('token') || ''
  }),
  getters: {
    // 获取用户信息
    getUserInfo: (state) => state.userInfo,
    // 获取 token
    getToken: (state) => state.token
  },
  actions: {
    // 设置用户信息
    setUserInfo(info = {}) {
      this.userInfo = info
      sessionStorage.setItem('userInfo', JSON.stringify(info))
    },
    // 设置 token
    setToken(token, expiresAt) {
      this.token = token
      if (token) {
        sessionStorage.setItem('token', token)
        if (expiresAt) {
          CookieStorage.set('token', token, expiresAt)
        }
      }
    },
    // 清除用户信息（登出）
    clearUserInfo() {
      this.userInfo = {}
      this.token = ''
      sessionStorage.removeItem('userInfo')
      sessionStorage.removeItem('token')
      CookieStorage.remove('token')
    }
  }
})