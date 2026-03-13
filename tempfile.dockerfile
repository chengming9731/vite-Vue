FROM node:18-alpine AS builder

WORKDIR /app

# 复制 package 文件并安装依赖
COPY package*.json ./
RUN npm install

# 复制源代码并构建应用
COPY src/page .
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 使用自定义 nginx 配置（处理 Vue Router 的 History 模式）
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建好的应用到 nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
