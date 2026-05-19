<template>
  <div class="flex center login">
    <div class="login-box">
      <div class="login-title">
        🍍
        <img alt="logo" src="https://github.githubassets.com/assets/profile-first-repo-fe2c6ecdd20b.svg">
      </div>
      <form @submit.prevent="handleSubmit" v-loading="loading" class="login-form">
        <div class="login-item">
          <label for="">用户名</label>
          <input v-model.trim="formData.username" class="input" placeholder="请输入用户名" type="text">
        </div>
        <div class="login-item">
          <label for="">密码</label>
          <div class="flex input">
            <input v-model.trim="formData.password" placeholder="请输入密码" :type="showPassword ? 'text' : 'password'">
            <i class="toggle-password" @click="togglePassword">{{ showPassword ? '👁️' : '🙈' }}</i>
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

        <button type="submit">登录</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive, ref } from 'vue'
import { getStore } from '@/stores'
import { login } from '@/api/user.js'
defineOptions({ name: 'user' })

const redirectTo = inject('redirectTo')
const { setUserInfo, setToken } = getStore('useUserStore')

const formData = reactive({
  username: 'xiaohu',
  password: '123456'
})

const loading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

// 切换密码显示/隐藏
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const validateForm = () => {
  if (!formData.username.trim()) {
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

    // const data = await fetch(`/api/users/${formData.username}`, { signal })
    login(formData).then(({ data }) => {
      const { accessToken, expiresAt, user } = data
      // 使用 Store 的方法设置用户信息和 token
      setUserInfo(user)
      setToken(accessToken, expiresAt)

      // 登录成功后跳转到首页
      redirectTo?.('/')
    }).catch(({ message }) => {
      errorMessage.value = message
    })
    // 取消请求
    // controller.abort()
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : '网络请求失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login {
  width: 100%;
}
.login-box {
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
  margin-bottom: 10px;
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

.login-item .input {
  flex: 1 0 auto;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  input {
    flex: 1 0 auto;
  }
}

.toggle-password {
  margin-left: 8px;
  cursor: pointer;
  font-style: normal;
  user-select: none;
  font-size: 18px;
  &:hover {
    opacity: 0.7;
  }
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