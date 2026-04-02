<template>
  <div class="login-box">
    <div class="login-title">
      🍍
      <img alt="logo" src="https://github.githubassets.com/assets/profile-first-repo-fe2c6ecdd20b.svg">
    </div>
    <form @submit.prevent="handleSubmit" v-loading="loading" class="login-form">
      <div class="login-item">
        <label for="">用户名</label>
        <input v-model.trim="formData.userName" placeholder="请输入用户名" type="text">
      </div>
      <div class="login-item">
        <label for="">密码</label>
        <input v-model.trim="formData.password" placeholder="请输入密码" type="password">
      </div>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <button type="submit">登录</button>
    </form>
  </div>
</template>

<script setup>
import { inject, reactive, ref } from 'vue'
import { useUserStore } from '@/stores/user'

defineOptions({ name: 'login' })

const redirectTo = inject('redirectTo')
const userStore = useUserStore()

const formData = reactive({
  userName: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

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
  errorMessage.value = ''
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    const controller = new AbortController()
    const signal = controller.signal

    const data = await fetch(`/api/users/${formData.userName}`, { signal })
    /* login(formData) */.then(res => {
      if (!res.ok) throw new Error(res.message || '登录失败')
      return res.json()
    })

    // 取消请求
    // controller.abort()

    userStore.setUserInfo(data)
    sessionStorage.setItem('userInfo', JSON.stringify(data))

    if (data.node_id) {
      sessionStorage.setItem('token', data.node_id)
    }

    redirectTo?.('/')
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : '网络请求失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-box {
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
