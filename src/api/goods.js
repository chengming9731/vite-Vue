import request from '@/plugin/axios.js'
// 获取商品列表
const products = (params = {}) => {
  // 如果 params 是对象且不是 null，使用 params 传参
  if (typeof params === 'object' && params !== null && !Array.isArray(params)) {
    return request({
      url: '/api/products',
      method: 'get',
      params
    })
  }

  // 获取商品详情 如果 params 是值（如 id），拼接到 URL
  return request({
    url: `/api/products/${params}`,
    method: 'get'
  })
}

export {  products }