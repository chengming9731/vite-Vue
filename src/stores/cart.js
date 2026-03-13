import { defineStore, storeToRefs } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    rawItem: []
  }),
  getters: {
    // 获取列表
    itemList: (state) => state.rawItem,
    itemCount(state) {
      return state.rawItem.length
    }
  },
  actions: {
    // 添加列表
    addItem(name) {
      this.rawItem.push({ name })
    },
    // 删除列表
    removeItem(item) {
      this.rawItem.splice(this.rawItem.indexOf(item), 1)
    },
    // 清空列表
    clearItem() {
      this.rawItem = []
    }
  },
  // 添加持久化配置
  persist: true
})
