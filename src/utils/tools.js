// 哈希缓存类 - 封装请求哈希生成和缓存管理功能
class RequestHashGenerator {
  constructor(config) {
    this.hashCache = new Map();
    this.CACHE_DURATION = 50; // 50ms缓存时间
    /** 提取核心参数
     * 结合 url、method、data、params 生成唯一哈希值
     * @param {Object} config - 请求配置对象
     * @returns {string} 生成的哈希值
     */
    const method = (config.method || 'GET').toUpperCase();
    const url = config.url || '';
    const baseURL = config.baseURL || '';
    const fullUrl = baseURL ? baseURL + url : url;

    // 生成请求特征字符串
    const signature = [
      method,
      fullUrl,
      this.serializeValue(config.params),
      this.serializeValue(config.data)
    ].filter(part => part !== '').join('|');

    return this.getOrCreateHash(signature);
  }

  /**
   * 深度序列化函数
   * @param {*} value - 需要序列化的值
   * @returns {string} 序列化后的字符串
   */
  serializeValue(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);

    // 处理FormData
    if (value instanceof FormData) {
      const formDataObj = {};
      for (let [key, val] of value.entries()) {
        formDataObj[key] = val instanceof File ? `[FILE:${val.name}]` : val;
      }
      value = formDataObj;
    }

    // 处理对象和数组
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return '[' + value.map(v => this.serializeValue(v)).join(',') + ']';
      } else {
        // 对象按键名排序
        const sortedKeys = Object.keys(value).sort();
        const pairs = sortedKeys.map(key => {
          const val = value[key];
          if (typeof val === 'function') return '';
          return `"${key}":${this.serializeValue(val)}`;
        }).filter(pair => pair !== '');
        return '{' + pairs.join(',') + '}';
      }
    }

    return String(value);
  }

  /**
   * 获取或创建哈希值
   * @param {string} signature - 请求特征签名
   * @returns {string} 哈希值
   */
  getOrCreateHash(signature) {
    const now = Date.now();

    // 清理过期缓存
    this.cleanupExpiredCache(now);

    // 如果缓存中存在且未过期，返回缓存的哈希值
    if (this.hashCache.has(signature)) {
      const cached = this.hashCache.get(signature);
      if (now - cached.timestamp <= this.CACHE_DURATION) {
        return cached.hash;
      }
    }

    // 生成新的哈希值
    const newHash = this.createHash(signature);

    // 存入缓存
    this.hashCache.set(signature, {
      hash: newHash,
      timestamp: now
    });

    return newHash;
  }

  /**
   * 清理过期缓存
   * @param {number} currentTime - 当前时间戳
   */
  cleanupExpiredCache(currentTime) {
    for (const [key, cached] of this.hashCache.entries()) {
      if (currentTime - cached.timestamp > this.CACHE_DURATION) {
        this.hashCache.delete(key);
      }
    }
  }

  /**
   * 创建哈希值
   * @param {string} str - 输入字符串
   * @returns {string} 生成的哈希值
   */
  createHash(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * 清空所有缓存
   */
  clearCache() {
    this.hashCache.clear();
  }

  /**
   * 获取缓存大小
   * @returns {number} 缓存项数量
   */
  getCacheSize() {
    return this.hashCache.size;
  }
}