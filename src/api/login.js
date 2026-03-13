import request from '@/plugin/axios.js'

const login = (data = {}) => {
  return request({
    url: `/api/users/octocat`,
    method: 'post',
    data
  })
}

export { login }
