<template>
  <ul class="sibling_index flexv">
    <li v-for="index in 10" :key="index" class="flex centerv shrink">索引 {{ index }}</li>
  </ul>
</template>

<script setup>
import { ref, inject } from 'vue'
defineOptions({ name: 'SiblingIndex' })
</script>

<style scoped>
@keyframes flipInX {
  0% {transform: rotate3d(1, 0, 0, 90deg);transition-timing-function: ease-in;opacity: 0}
  40% {transform: rotate3d(1, 0, 0, -20deg);transition-timing-function: ease-in}
  60% {transform: rotate3d(1, 0, 0, 10deg);opacity: 1}
  80% {transform: rotate3d(1, 0, 0, -5deg)}
  100% {transform: perspective(400px)}
}
.sibling_index {
  li {
    animation: flipInX 1.5s both calc((sibling-index() - 1) * 0.3s);
    color: #000;
    --variant: primary;
    background: if(style(--variant:primary): var(--xh-bg-color); style(--variant: success): #28a745; style(--variant: danger): #dc3545; else: #bdccda); /*CSS if() 函数*/
  }
}
</style>
