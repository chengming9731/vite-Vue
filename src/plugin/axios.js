import axios from 'axios'
import { RequestHashGenerator } from '@/utils/tools'

const hashGenerator = new RequestHashGenerator()
const pendingRequestMap = new Map()

const getRequestKey = (config = {}) => {
  const requestParams = { ...(config.params || {}) }

  return hashGenerator.generate({
    method: config.method,
    url: config.url,
    baseURL: config.baseURL,
    params: requestParams,
    data: config.data
  })
}

const removePendingRequest = (config = {}) => {
  const requestKey = getRequestKey(config)
  if (pendingRequestMap.has(requestKey)) {
    pendingRequestMap.delete(requestKey)
  }
}

const addPendingRequest = (config = {}) => {
  const requestKey = getRequestKey(config)

  // 相同请求只保留最新一次，取消旧请求
  if (pendingRequestMap.has(requestKey)) {
    const previousController = pendingRequestMap.get(requestKey)
    previousController.abort('重复请求已取消')
    pendingRequestMap.delete(requestKey)
  }

  const controller = new AbortController()
  config.signal = controller.signal
  pendingRequestMap.set(requestKey, controller)
}

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // API 基础路径
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    console.log('🚀 发送请求:', config)

    // 添加认证 token（如果存在）
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加时间戳防止缓存
    if ((config.method || '').toLowerCase() === 'get') {
      config.params = {
        ...config.params
      }
    }

    addPendingRequest(config)

    return config
  },
  error => {
    // 对请求错误做些什么
    console.error('❌ 请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    console.log('✅ 响应成功:', response)

    removePendingRequest(response.config)

    const res = response.data

    // 根据后端约定的状态码进行处理
    if (res.code !== 200) {
      // 业务错误处理
      console.error('🚨 业务错误:', res.message || '请求失败')

      // 可以在这里统一处理错误提示
      // 例如使用 Element Plus 的消息提示
      // ElMessage.error(res.message || '请求失败')

      // 如果是 token 过期，跳转到登录页
      if (res.code === 401) {
        localStorage.removeItem('token')
        // window.location.href = '/login'
      }

      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      // 返回成功的数据
      return res
    }
  },
  error => {
    // 对响应错误做点什么
    console.error('❌ 响应错误:', error)

    if (error.config) {
      removePendingRequest(error.config)
    }

    if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
      return Promise.reject(new Error('请求已取消'))
    }

    // 处理网络错误
    if (error.response) {
      // 服务器返回了错误状态码
      switch (error.response.status) {
        case 401:
          console.error('🚨 未授权，请重新登录')
          localStorage.removeItem('token')
          // window.location.href = '/login'
          break
        case 403:
          console.error('🚨 拒绝访问')
          break
        case 404:
          console.error('🚨 请求地址出错')
          break
        case 500:
          console.error('🚨 服务器内部错误')
          break
        default:
          console.error(`🚨 错误:${error.response.status}`)
      }
    } else if (error.request) {
      // 网络错误
      console.error('🚨 网络错误，请检查网络连接')
    } else {
      // 其他错误
      console.error('🚨 请求配置错误')
    }

    return Promise.reject(error)
  }
)

export default service
