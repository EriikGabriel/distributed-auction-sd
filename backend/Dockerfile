# Use uma imagem base do Python
FROM python:3.9-slim

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos necessários
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

# Expõe a porta do Flask
EXPOSE 5000

# Comando para iniciar o aplicativo Flask
CMD ["python", "app.py"]
