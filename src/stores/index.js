import { createPinia } from 'pinia'
import { registerPlugins } from './plugins'
import { useThemeStore } from './theme'
import { useUserStore } from './user'
import { useCartStore } from './cart'

export const pinia = createPinia()
registerPlugins(pinia)

const storeFactories = {
  useThemeStore,
  useUserStore,
  useCartStore
}

export const getStore = (storeName) => {
  const factory = storeFactories[storeName]
  if (!factory) {
    throw new Error(`Store \"${storeName}\" 不存在`)
  }
  return factory()
}

export default pinia
