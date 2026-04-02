<template>
  <template v-if="userStore.userInfo.id">
    <div class="aside" :class="{ collapsed: isAsideCollapsed }" :style="{ width: asideWidth }">
      <button class="collapse-btn" type="button" @click="toggleAside">
        {{ isAsideCollapsed ? '展开' : '折叠' }}
      </button>
    </div>
    <div class="flexitemv container">
      <header class="flex shrink justify header">
        <nav>
          <RouterLink to="/">Home</RouterLink>|
          <RouterLink to="/imgPica">imgPica</RouterLink>|
          <RouterLink to="/about">About</RouterLink>|
          <RouterLink to="/positionStiky">positionStiky</RouterLink>
        </nav>
        <label class="theme" for="theme">
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
      </header>
      <main class="flexitemv main" v-loading="loading">
        <RouterView/>
        <div class="scroll"></div>
      </main>
      <footer class="flex shrink center footer">| footer |</footer>
    </div>
  </template>
  <RouterView v-else/>
</template>

<script setup>
defineOptions({ name: 'App' })
import { ref, toRef, computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { getStore } from '@/stores'

const themeStore = getStore('useThemeStore')
const userStore = getStore('useUserStore')
const theme = ref(themeStore.getCurrentThemeClass)
const loading = ref(false)
const isAsideCollapsed = ref(false)
const asideWidth = computed(() => (isAsideCollapsed.value ? '56px' : '200px'))

console.log(userStore)
const handleTheme = () => {
  themeStore.toggleTheme(theme.value)
}

const toggleAside = () => {
  isAsideCollapsed.value = !isAsideCollapsed.value
}

</script>

<style scoped>
@property --scroll-position {syntax: "<number>";inherits: true;initial-value: 0;}
@property --scroll-position-delayed {syntax: "<number>";inherits: true;initial-value: 0;}
@property --scroll-velocity {syntax: "<number>";inherits: true;initial-value: 0;}
@keyframes adjust-pos {to{--scroll-position: 100;--scroll-position-delayed: 100;}}
.aside {
  width: 200px;
  flex-shrink: 0;
  background: #b6fd92;
  transition: width .25s ease;
  padding: 8px;
}
.collapse-btn {
  width: 100%;
  height: 34px;
  border-radius: 6px;
  background: #3384ee;
  color: #fff;
  cursor: pointer;
}
.aside.collapsed .collapse-btn {
  font-size: 12px;
}
.container {
  min-width: 0;
  .header {height: 50px;background: #5b9cf6}
  .main {
    overflow: auto;

    animation: adjust-pos 1s linear both;
    animation-timeline: scroll(block self); /*动画时间线*/
    .scroll {
      transition: --scroll-position-delayed 2s linear;
      --scroll-velocity: calc(var(--scroll-position) - var(--scroll-position-delayed));
      --scroll-speed: max(var(--scroll-velocity), -1 * var(--scroll-velocity)); /*取滚动方向绝对值*/
      background: if(style(--scroll-velocity: 0): yellow; else: red);

      counter-reset: scroll-speed calc(var(--scroll-speed) * 1) scroll-velocity calc(var(--scroll-velocity) * 1);
      &::after{
        content: "scroll-speed: " counter(scroll-speed) "| scroll-velocity: " counter(scroll-velocity);
      }
    }
  }
  .footer {height: 50px;background: #9e9d9d;}
}
</style>
