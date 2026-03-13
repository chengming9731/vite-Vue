<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" role="img"/>
    </a>
    <a href="https://cn.vuejs.org/guide/introduction.html" target="_blank">
      <img src="./assets/img/vue.svg" class="logo vue" alt="Vue logo" role="img"/>
    </a>
    <label for="theme">
      <span>主题: </span>
      <select v-model="theme" @change="handleTheme">
        <option disabled selected hidden>请选择</option>
        <option
          v-for="item of themeStore.getAllThemes"
          :value="item"
          :key="item"
        >{{ item }}</option>
      </select>
    </label>
  </div>

  <nav>
    <RouterLink to="/">Home</RouterLink>|
    <RouterLink to="/imgPica">imgPica</RouterLink>|
    <RouterLink to="/about">About</RouterLink>|
    <RouterLink to="/positionStiky">positionStiky</RouterLink>
  </nav>

  <RouterView/>
</template>

<script setup>
defineOptions({ name: 'App' })
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { getStore } from '@/stores'
// import { useThemeStore } from '@/stores/theme'

const themeStore = getStore('useThemeStore')
const theme = ref(themeStore.getCurrentThemeClass)

const handleTheme = () => {
  themeStore.toggleTheme(theme.value)
}

</script>

<style scoped>

</style>
