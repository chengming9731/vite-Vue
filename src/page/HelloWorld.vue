<template>
  <h3>{{ msg }}</h3>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
    >create-vue</a>, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
    >Vue Docs Scaling up Guide</a>.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>

  <img @click="handleCalll" :src="userInfo?.avatar_url" class="avatar" alt="🍍用户头像">

  <div @click="handleRecorder" class="property">录音</div>

  <SiblingIndex></SiblingIndex>
</template>

<script setup>
defineOptions({ name: 'HelloWorld' })
import { inject, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import SiblingIndex from '@/page/SiblingIndex.vue'
defineProps({
  msg: {
    type: String,
    default: '我不听 我不听'
  }
})
const navigateTo = inject('navigateTo'); // 注入路由方法

const count = ref(0)

const { userInfo = {} } = storeToRefs(useUserStore())
// 跳转通话
const handleCalll = () => {
  navigateTo('/audioCall')
}
// 跳转录音
const handleRecorder = () => {
  navigateTo('/mediaRecorder')
}

</script>

<style scoped>
.read-the-docs, p {
  color: var(--xh-text-color);
}
.avatar {
  width: 100px;
}
@property --gradient {
  syntax: "<color>";
  inherits: false;
  initial-value: #ad92ff;
}
.property {
  width: 100px;
  height: 100px;
  background: linear-gradient(#fff, var(--gradient));
  transition: --gradient 2s;
  &:hover {
    --gradient: #91ff6b;
  }
}
</style>
