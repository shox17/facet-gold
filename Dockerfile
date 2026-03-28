# syntax=docker/dockerfile:1

# --- Stage 1: Dependencies ---
    FROM node:20-bookworm-slim AS deps
    WORKDIR /app
    COPY package.json package-lock.json ./
    RUN npm ci
    
    # --- Stage 2: Build ---
    FROM deps AS build
    WORKDIR /app
    COPY tsconfig.json ./
    # 소스 전체를 복사 (Copy all source files)
    COPY . . 
    RUN npm run build
    
    # --- Stage 3: Runner ---
    FROM node:20-bookworm-slim AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    
    COPY package.json package-lock.json ./
    RUN npm ci --omit=dev
    
    # 빌드된 JS 파일 복사
    COPY --from=build /app/dist ./dist
    
    # ✅ 중요: 정적 파일(이미지, 뷰) 경로 확인 및 복사
    # 만약 src 내부에 있다면 아래 경로가 맞습니다.
    COPY --from=build /app/src/public ./dist/public
    COPY --from=build /app/src/views ./dist/views
    
    # ✅ 중요: uploads 폴더 생성 및 권한 설정
    # 컨테이너 내부에서 이미지를 저장할 수 있도록 폴더를 미리 만듭니다.
    RUN mkdir -p uploads && chmod 777 uploads
    
    EXPOSE 3004
    CMD ["node", "dist/server.js"]