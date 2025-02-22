# Estágio de construção
FROM node:18 as build

WORKDIR /app

# Copie os arquivos de configuração primeiro para usar o cache
COPY package.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos
COPY . .

# Construa a aplicação
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Copie os arquivos de build para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponha a porta 80
EXPOSE 80

# Inicie o Nginx
CMD ["nginx", "-g", "daemon off;"]
