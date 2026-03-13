import { defineStore, storeToRefs } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: JSON.parse(sessionStorage.getItem('userInfo')) || {}
  }),
  getters: {
    // 获取用户信息
    getUserInfo: (state) => state.userInfo
  },
  actions: {
    // 添加用户信息
    setUserInfo(info = {}) {
      this.userInfo = info
    }
  },
  // 添加持久化配置
  // persist: true
})