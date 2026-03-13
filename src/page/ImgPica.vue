<template>
  <div class="img-pica-container">
    <h2>图片压缩工具</h2>

    <div class="upload-section">
      <input
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        ref="fileInputRef"
      />
      <button @click="triggerFileSelect" v-if="!selectedImage">选择图片</button>
    </div>

    <!-- 显示原始图片 -->
    <div class="image-preview" v-if="selectedImage">
      <h3>原始图片</h3>
      <img :src="selectedImage" alt="原始图片" class="original-image" />
      <p>原始大小: {{ originalSize }}</p>
    </div>

    <!-- 压缩参数设置 -->
    <div class="compress-options" v-if="selectedImage">
      <h3>压缩设置</h3>
      <label>
        压缩质量:
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          v-model.number="quality"
        />
        {{ quality }}
      </label>

      <label>
        最大宽度:
        <input
          type="number"
          v-model.number="maxWidth"
          placeholder="输入最大宽度"
        />
      </label>

      <label>
        最大高度:
        <input
          type="number"
          v-model.number="maxHeight"
          placeholder="输入最大高度"
        />
      </label>
    </div>

    <!-- 压缩操作按钮 -->
    <div class="compress-actions" v-if="selectedImage">
      <button @click="compressImage">压缩图片</button>
      <button @click="downloadCompressed" v-if="compressedImage">下载压缩图片</button>
    </div>

    <!-- 显示压缩后图片 -->
    <div class="compressed-preview" v-if="compressedImage">
      <h3>压缩后图片</h3>
      <img :src="compressedImage" alt="压缩后图片" class="compressed-image" />
      <p>压缩后大小: {{ compressedSize }}</p>
      <p>压缩率: {{ compressionRate }}%</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
defineOptions({ name: 'ImgPica' })

const fileInputRef = ref(null);
const selectedImage = ref('');
const compressedImage = ref('');
const quality = ref(0.8); // 默认压缩质量为0.8
const maxWidth = ref(800);
const maxHeight = ref(600);
const fileName = ref(crypto.randomUUID()); // 唯一 UUID

const originalSize = computed(() => {
  if (!selectedImage.value) return '';

  // 计算原始图片大小（近似值）
  const base64Length = selectedImage.value.length - ('data:image/jpeg;base64,'.length);
  const sizeInBytes = Math.round(base64Length * 0.75);
  return formatFileSize(sizeInBytes);
});

const compressedSize = computed(() => {
  if (!compressedImage.value) return '';

  // 计算压缩后图片大小（近似值）
  const base64Length = compressedImage.value.length - ('data:image/jpeg;base64,'.length);
  const sizeInBytes = Math.round(base64Length * 0.75);
  return formatFileSize(sizeInBytes);
});

const compressionRate = computed(() => {
  if (!selectedImage.value || !compressedImage.value) return 0;

  const originalLength = selectedImage.value.length - ('data:image/jpeg;base64,'.length);
  const compressedLength = compressedImage.value.length - ('data:image/jpeg;base64,'.length);

  return ((1 - compressedLength / originalLength) * 100).toFixed(2);
});

// 触发文件选择器
const triggerFileSelect = () => {
  fileInputRef.value.click();
};

// 处理文件选择
const handleFileSelect = ({ target }) => {
  const file = target.files[0];
  if (file && file.type.startsWith('image/')) {
    fileName.value = file.name;
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      selectedImage.value = target.result;
      compressedImage.value = ''; // 清除之前的压缩结果
    };
    reader.readAsDataURL(file);
  }
};

// 图片压缩函数
const compressImage = () => {
  if (!selectedImage.value) return;

  const img = new Image();
  img.src = selectedImage.value;

  img.onload = () => {
    // 创建canvas元素
    const canvas = document.createElement('canvas');
    let { width, height } = calculateNewDimensions(img.width, img.height, maxWidth.value, maxHeight.value);

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    // 设置背景为白色（针对透明图片）
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // 绘制图片到canvas
    ctx.drawImage(img, 0, 0, width, height);

    // 转换为数据URL
    const mimeType = 'image/jpeg'; // 使用jpeg格式以获得更好的压缩效果
    compressedImage.value = canvas.toDataURL(mimeType, parseFloat(quality.value));
  };
};

// 根据最大宽高计算新的尺寸（保持比例）
const calculateNewDimensions = (originalWidth, originalHeight, maxWidth, maxHeight) => {
  let width = originalWidth;
  let height = originalHeight;

  // 如果原图比设定的最大尺寸小，则不放大
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  // 计算缩放比例
  const ratio = Math.min(maxWidth / width, maxHeight / height);

  // 应用缩放
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);

  return { width, height };
};

// 下载压缩后的图片
const downloadCompressed = () => {
  if (!compressedImage.value) return;

  const link = document.createElement('a');
  link.href = compressedImage.value;
  link.download = fileName.value;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<style scoped>
.img-pica-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  /* 添加五彩斑斓的黑背景效果 */
  background: radial-gradient(ellipse at center,
  rgba(0,0,0,1) 0%,
  rgba(20,10,30,1) 20%,
  rgba(10,5,20,1) 40%,
  rgba(5,0,15,1) 60%,
  rgba(0,0,0,1) 80%);
  /* 添加微妙的渐变和纹理感 */
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.upload-section {
  margin-bottom: 20px;
  text-align: center;
}

.upload-section input[type="file"] {
  display: none;
}

.upload-section button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.image-preview, .compress-options, .compressed-preview {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.original-image, .compressed-image {
  max-width: 100%;
  max-height: 300px;
  display: block;
  margin: 10px 0;
}

.compress-options label {
  display: block;
  margin: 10px 0;
}

.compress-options input[type="range"] {
  width: 200px;
  vertical-align: middle;
}

.compress-options input[type="number"] {
  width: 100px;
  padding: 5px;
  margin-left: 10px;
}

.compress-actions {
  text-align: center;
  margin: 20px 0;
}

.compress-actions button {
  background-color: #2196F3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 10px;
}

.compress-actions button:hover {
  background-color: #1976D2;
}
</style>
