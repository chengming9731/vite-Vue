import '@/assets/css/theme.css'
import '@/assets/css/style.css'
import { createApp } from 'vue'
import App from './App.vue'
import pinia from '@/stores'
import router from '@/router'
import directives from '@/utils/directives' // 注册自定义指令
import { useThemeStore } from '@/stores/theme'

const app = createApp(App)

app.provide('redirectTo', (path) => router.replace(path)); // 关闭当前页面，跳转到应用内的某个页面
app.provide('navigateTo', (path) => router.push(path)); // 保留当前页面，跳转到应用内的某个页面
app.use(directives).use(pinia).use(router).mount('#app')

// 初始化主题
const themeStore = useThemeStore()
themeStore.initTheme()