# Projeto final de Sistemas Distribuídos - Leilão Online Distribuído

**Integrantes**

- Erik Gabriel Rodrigo da Silva
- Felipe Bonadia de Oliveira Bravo

**Objetivo**

> Projetar, implementar, implantar e testar uma **plataforma de leilão online distribuída** utilizando **virtualização com Multipass**, **Redis**, **Docker Swarm** e **Flask**. O sistema deve ser escalável, tolerante a falhas e capaz de lidar com um grande número de usuários simultâneos com tempo de inatividade mínimo.

## Estrutura de pastas e arquivos do projeto

```
auction-system/
├── backend/
│ ├── app/
│ │ ├── init.py # Inicialização e configuração da aplicação Flask
│ │ ├── config.py # Variáveis de configuração (ex.: conexão com Redis)
│ │ ├── models.py # Definição das estruturas de dados para leilões e lances
│ │ ├── routes.py # Rotas da API:
│ │ │ # /create-auction, /view-auctions, /place-bid e /auction/{auction_id}
│ │ └── redis_pubsub.py # Implementação do Pub/Sub com Redis para notificações em tempo real
│ ├── run.py # Ponto de entrada da aplicação Flask
│ └── requirements.txt # Dependências Python (Flask, redis, Flask-SocketIO, etc.)
│
├── frontend/
│ ├── public/
│ │ └── index.html # Arquivo HTML principal para o React (template)
│ ├── src/
│ │ ├── components/
│ │ │ ├── ActiveAuctions.jsx # Exibe a lista de leilões ativos
│ │ │ ├── AuctionCard.jsx # Mostra detalhes e lances em tempo real de um leilão
│ │ │ ├── ClosedAuctions.jsx # Exibe a lista de leilões encerrados
│ │ │ ├── CreateAuction.jsx # Formulário para criação de um novo leilão
│ │ │ └── Header.jsx # Cabeçalho da aplicação
│ │ ├── services/
│ │ │ └── api.js # Funções para interagir com a API do Flask (fetch/axios)
│ │ ├── utils/
│ │ │ └── cn.js # Função para lidar com as mudança de estilo (classes) do tailwind através de condicionais
│ │ ├── App.jsx # Componente principal que orquestra os demais componentes
│ │ ├── index.css # Folha de estilos principal da aplicação
│ │ └── main.jsx # Ponto de entrada da aplicação React
│ └── package.json # Dependências e scripts do projeto React
│
├── docker/
│ ├── Dockerfile # Define a imagem Docker para a aplicação (pode ser separado para backend e frontend, se necessário)
│ ├── docker-compose.yml # Configuração para orquestração local dos contêineres (Flask, Redis, React)
│ └── swarm-init.sh # Script para inicializar e configurar o cluster Docker Swarm
│
├── multipass/
│ └── setup_multipass.sh # Script para criar VMs com Multipass e configurar a rede entre os nós (Flask e Redis)
├── .gitignore # Arquivo .gitignore para o repositório github
└── README.md # Documentação geral do projeto
```

## Setup - Front-end

Para configurar o front-end, basta entrar na pasta _frontend_ e pelo terminal digitar os seguintes comandos

```bash
npm install # Para instalar todas as dependências do projeto
```

```bash
npm run dev # Para rodar o servidor de desenvolvimento local do projeto
```

Pronto! Agora o front-end deve estar acessível através da URL: [http://localhost:5173/](http://localhost:5173/)
