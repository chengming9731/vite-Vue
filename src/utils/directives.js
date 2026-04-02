// loading 指令
const loadingDirective = {
  mounted(el, binding) {
    // 创建 loading 遮罩元素
    const loadingMask = document.createElement('div');
    loadingMask.className = 'loading-mask';

    // 创建 loading 图标
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    loadingMask.appendChild(loadingSpinner);

    // 设置元素相对定位以便遮罩层正确定位
    const computedStyle = window.getComputedStyle(el);
    if (computedStyle.position !== 'relative' && computedStyle.position !== 'absolute') {
      el.style.position = 'relative';
    }

    // 将遮罩添加到元素中
    el.appendChild(loadingMask);

    // 存储引用
    el._loadingMask = loadingMask;

    // 根据绑定值控制显示/隐藏
    if (binding.value) {
      loadingMask.style.display = 'flex';
    } else {
      loadingMask.style.display = 'none';
    }
  },

  updated(el, binding) {
    // 当指令值发生变化时更新显示状态
    if (binding.value !== binding.oldValue) {
      if (binding.value) {
        el._loadingMask.style.display = 'flex';
      } else {
        el._loadingMask.style.display = 'none';
      }
    }
  },

  unmounted(el) {
    // 清理资源
    if (el._loadingMask) {
      el._loadingMask.remove();
      el._loadingMask = null;
    }
  }
};

// 深拷贝 structuredClone(obj)
// 导出默认对象，包含所有指令
export default {
  async install(app) {
    // 注册自定义指令
    app.directive('loading', loadingDirective)
  }
};