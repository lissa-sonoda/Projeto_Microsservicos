#  quero uma imagem com o node versão 14
FROM node:14

# um diretório no sistema de arquivos do container para os comandos a seguir
WORKDIR /app

# está copiando o package.json para poder executar o npm install
COPY package.json .

# executando o npm install
RUN npm install

# para copiar os demais arquivos
COPY . .

# coloca o aplicativo em execução
CMD [ "npm", "start" ]
