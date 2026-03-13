import { createPinia, defineStore } from 'pinia'
import { registerPlugins } from './plugins'

// 创建 pinia 实例
export const pinia = createPinia()

// 注册插件
registerPlugins(pinia)

// 运行时自动发现和缓存 stores
class StoreRegistry {
  constructor() {
    this.cache = new Map()
    this.discovering = false
    this.discoverStores()
  }

  discoverStores() {
    if (this.discovering) return this.cache

    this.discovering = true
    try {
      const storeModules = import.meta.glob('./!(index|plugins).js', { eager: true })

      Object.entries(storeModules).forEach(([path, module]) => {
        const moduleName = path.match(/\.\/(.+)\.js$/)?.[1]
        if (moduleName) {
          Object.entries(module).forEach(([key, value]) => {
            // 校验命名规范
            if (key.startsWith('use') && key.endsWith('Store') && typeof value === 'function') {
              this.cache.set(key, value)
            }
          })
        }
      })
    } finally {
      this.discovering = false
    }

    return this.cache
  }

  /**
   * 获取指定名称的 store 实例
   * 从缓存中获取对应的 store 构造函数并执行创建实例
   * @param {string} storeName - 要获取的 store 名称（如 'useCartStore'）
   * @returns {Object} 返回创建的 store 实例
   */
  getStore(storeName) {
    return this.cache.get(storeName)()
  }
}
const storeRegistry = new StoreRegistry()
// 提供便捷的访问方法
/**
 * 获取指定名称的 store 实例
 * @param {string} storeName - 要获取的 store 名称（如 'useCartStore'）
 */
export const getStore = (storeName) => storeRegistry.getStore(storeName)

export default pinia