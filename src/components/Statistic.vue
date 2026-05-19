NEW_FILE_CODE
<template>
  <div class="statistic">
    <div class="stat-value" :style="{ color: color }">
      <span ref="valueRef">{{ displayValue }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  value: {
    type: [Number, String],
    required: true
  },
  color: {
    type: String,
    default: '#00f2fe'
  },
  duration: {
    type: Number,
    default: 1500
  },
  decimals: {
    type: Number,
    default: 0
  }
})

const valueRef = ref(null)
const displayValue = ref(0)
let animationFrameId = null

// 判断是否为数字（支持带逗号的千分位字符串）
const isNumeric = (val) => {
  if (typeof val === 'number') {
    return !isNaN(val) && isFinite(val)
  }

  if (typeof val === 'string') {
    // 移除逗号、百分号等符号后判断
    const cleaned = val.replace(/[,\s%]/g, '')
    const num = parseFloat(cleaned)
    return !isNaN(num) && isFinite(num) && cleaned !== ''
  }

  return false
}

// 格式化数值
const formatValue = (val) => {
  if (!isNumeric(val)) {
    return val
  }

  const num = parseFloat(val)
  if (props.decimals > 0) {
    return num.toFixed(props.decimals)
  }

  // 如果原值包含逗号分隔符，保持格式
  if (typeof props.value === 'string' && props.value.includes(',')) {
    return Math.floor(num).toLocaleString()
  }

  return Math.floor(num)
}

// 执行数值动画
const animateValue = (start, end, duration) => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  const startTime = performance.now()

  const updateValue = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // 使用缓动函数 (easeOutQuart)
    const easeProgress = 1 - Math.pow(1 - progress, 4)

    const currentValue = start + (end - start) * easeProgress
    displayValue.value = formatValue(currentValue)

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(updateValue)
    } else {
      displayValue.value = formatValue(end)
    }
  }

  animationFrameId = requestAnimationFrame(updateValue)
}

// 提取纯数字
const extractNumber = (val) => {
  // 如果是数字类型，直接返回
  if (typeof val === 'number') {
    return !isNaN(val) && isFinite(val) ? val : 0
  }

  // 如果是字符串，清理后转换
  if (typeof val === 'string') {
    const cleaned = val.replace(/[,\s%]/g, '')
    const num = parseFloat(cleaned)
    return !isNaN(num) && isFinite(num) ? num : 0
  }

  return 0
}

// 监听 value 变化
watch(() => props.value, (newVal, oldVal) => {
  const startNum = extractNumber(oldVal || 0)
  const endNum = extractNumber(newVal)

  animateValue(startNum, endNum, props.duration)
}, { immediate: false })

onMounted(() => {
  // 初始值设置为 0，然后动画到目标值
  const targetNum = extractNumber(props.value)
  animateValue(0, targetNum, props.duration)
})
</script>

<style scoped>
.statistic {
  text-align: center;
  padding: 15px;
  background: rgba(0, 242, 254, 0.05);
  border-radius: 6px;
  border: 1px solid rgba(0, 242, 254, 0.1);
  transition: all 0.3s;
}

.statistic:hover {
  background: rgba(0, 242, 254, 0.1);
  transform: translateY(-2px);
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
  font-family: 'Courier New', monospace;
}
</style>