<template>
  <div class="login-box">
    <div class="login-title">
      🍍
      <img alt="logo" src="https://github.githubassets.com/assets/profile-first-repo-fe2c6ecdd20b.svg">
    </div>
    <form @submit.prevent="handleSubmit" v-loading="loading" class="login-form">
      <div class="login-item">
        <label for="">用户名</label>
        <input v-model.trim="formData.userName" placeholder="请输入 github 用户名" type="text">
      </div>
      <div class="login-item">
        <label for="">密码</label>
        <input v-model.trim="formData.password" placeholder="请输入密码" type="password">
      </div>

      <!-- 错误消息显示 -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <button type="submit">登录</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from 'vue'
defineOptions({ name: 'login' })
const redirectTo = inject('redirectTo'); // 注入路由方法
import { useUserStore } from '@/stores/user'
import { login } from '@/api/login.js'

const userStore = useUserStore()

const formData = reactive({
  userName: '',
  password: ''
})

const loading = ref(false)
// 添加错误消息状态
const errorMessage = ref('')

// 添加验证函数
const validateForm = () => {
  if (!formData.userName.trim()) {
    errorMessage.value = '请输入用户名'
    return false
  }
  if (!formData.password.trim()) {
    errorMessage.value = '请输入密码'
    return false
  }
  if (formData.password.length < 6) {
    errorMessage.value = '密码长度不能少于6位'
    return false
  }
  return true
}

const handleSubmit = async () => {
  // 先验证表单
  if (!validateForm()) {
    return
  }
  loading.value = true
  /* fetch('/api/users/octocat', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(formData)
  }) */
  fetch(`/api/users/${formData.userName}`)
  /* login(formData) */.then(response => {
    console.log(response)
    return response.json()
  }).then(data => {
    redirectTo('/')
    // 存储用户信息
    userStore.setUserInfo(data)
    sessionStorage.setItem('userInfo', JSON.stringify(data))
  }).catch(err => {
    errorMessage.value = err.message || '网络请求失败，请稍后重试'
  }).finally(() => {
    loading.value = false
  })
}
</script>

<style scoped>
.login-box {
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  //align-items: center;
  background: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.login-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.login-item label {
  min-width: 70px;
  margin-bottom: 5px;
  font-weight: bold;
}

.login-item input {
  flex: 1 0 auto;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
}

button {
  padding: 10px;
  background: var(--xh-bg-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: var(--xh-bg-hover-color);
  }
}
</style>