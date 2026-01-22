# apps/audit-service/Dockerfile

FROM node:18-alpine

WORKDIR /app

# 1. Copiamos archivos de dependencias
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 2. Instalamos PNPM y dependencias
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# 3. Copiamos todo el código fuente
COPY . .

# 4. Construimos ESTE microservicio específico
# (Nx sabe cómo construir solo este pedazo)
RUN npx nx build api-gateway --configuration=production

# 5. Comando de inicio
CMD ["node", "dist/apps/api-gateway/main.js"]