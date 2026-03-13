<template>
  <div class="position-stiky">
    <div class="navbar">🍍navbar</div>
    <div class="nav">
      <div class="nav-item">nav-item🍍</div>
    </div>
    <div class="stiky-container">
      <div class="stiky-item" v-for="i of 50" :key="i">{{ i }}</div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'PositionStiky' })
import { ref, inject, onMounted } from 'vue'


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
  }
}
</style>