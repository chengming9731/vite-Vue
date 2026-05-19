<template>
  <div class="position-stiky">
    <div class="navbar">🍍navbar</div>
    <div class="nav">
      <div class="nav-item">nav-item🍍</div>
    </div>
    <SiblingIndex></SiblingIndex>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import SiblingIndex from '@/page/SiblingIndex.vue'
defineOptions({ name: 'PositionStiky' })

</script>

<style scoped>
.position-stiky {
  overflow: auto;
  .navbar {
    height: 50px;
    background: var(--xh-bg-color);
  }
  .nav {
    position: sticky;
    top: 0;
    height: 30px;
    background: var(--xh-text-color);
    z-index: 1;
  }
}
</style>