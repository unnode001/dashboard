# ---- Stage 1: Builder ----
# 使用一个包含完整构建工具的Node.js镜像作为构建环境
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package*.json ./

# 安装所有依赖项（包括开发依赖）
RUN npm install

# 复制所有剩余的前端源代码
COPY . .

# 执行构建命令
RUN npm run build

# ---- Stage 2: Runner ----
# 使用一个更轻量的Node.js镜像作为最终的运行环境
FROM node:20-alpine AS runner

# 设置工作目录
WORKDIR /app

# 创建一个非root用户，提高安全性
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 从构建器阶段(builder)复制已优化的产物
# .next/standalone 目录包含了运行应用所需的所有文件
COPY --from=builder /app/.next/standalone ./

# 复制 public 目录
COPY --from=builder /app/public ./public

# 切换到非root用户
USER nextjs

# 暴露Next.js默认的3000端口
EXPOSE 3000

# 设置环境变量，确保Node.js在生产模式下运行
ENV NODE_ENV=production

# 启动应用的命令
# 使用 "node server.js" 来运行 .next/standalone 中的服务器
CMD ["node", "server.js"]