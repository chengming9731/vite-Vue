/**
 * Pinia 插件集合
 */
// 学习练习用的插件
function useLianxiPlugin(context) {
  return {
    secret: '学习使用插件用法',
    pluginName: 'lianxi-plugin'
  }
}

// 日志插件 - 记录 store 状态变化
function useLoggerPlugin(context) {
  const { store } = context

  // 保存原始的 $patch 方法
  const originalPatch = store.$patch

  // 重写 $patch 方法来添加日志
  store.$patch = function(patch) {
    console.group(`🍍${store.$id} patch`)
    console.log('Before:', store.$state)
    originalPatch.call(this, patch)
    console.log('After:', store.$state)
    console.groupEnd()
  }

  return {
    loggerEnabled: true
  }
}

// 持久化插件 - 自动保存到 localStorage
function usePersistencePlugin(context) {
  const { store, options } = context

  // 如果 store 配置了 persist 选项，则启用持久化
  if (options.persist) {
    const storageKey = `${store.$id}-storage`

    // 从 localStorage 恢复状态
    const savedState = localStorage.getItem(storageKey)
    if (savedState) {
      try {
        store.$patch(JSON.parse(savedState))
      } catch (error) {
        console.warn(`Failed to restore ${store.$id} from localStorage:`, error)
      }
    }

    // 监听状态变化并保存到 localStorage
    store.$subscribe((mutation, state) => {
      localStorage.setItem(storageKey, JSON.stringify(state))
    })
  }

  return {
    persistenceEnabled: !!options.persist
  }
}

// 注册所有插件
export function registerPlugins(pinia) {
  pinia.use(useLianxiPlugin)
  pinia.use(useLoggerPlugin)
  pinia.use(usePersistencePlugin)
}
