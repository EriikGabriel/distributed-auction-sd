#!/bin/bash

# ========================
# Setup do Multipass
# ========================

echo "🖥️ Criando VMs no Multipass..."

multipass launch -n manager -c 2 -m 2G -d 10G
multipass launch -n worker1 -c 2 -m 2G -d 10G
multipass launch -n worker2 -c 2 -m 2G -d 10G

echo "✅ VMs criadas!"
multipass list

# ========================
# Instalando Docker
# ========================

echo "🐳 Instalando Docker nas VMs..."

for node in manager worker1 worker2; do
    multipass exec $node -- bash -c "
        curl -fsSL https://get.docker.com | sh &&
        sudo usermod -aG docker ubuntu
    "
done

echo "✅ Docker instalado!"

# ========================
# Configurando Docker Swarm
# ========================

echo "🚀 Inicializando Docker Swarm no Manager..."
multipass exec manager -- docker swarm init --advertise-addr $(multipass info manager | grep IPv4 | awk '{print $2}')
SWARM_JOIN_CMD=$(multipass exec manager -- docker swarm join-token worker | grep 'docker swarm join')

echo "🔗 Adicionando Workers ao Swarm..."
for node in worker1 worker2; do
    multipass exec $node -- bash -c "$SWARM_JOIN_CMD"
done

echo "✅ Docker Swarm configurado!"
multipass exec manager -- docker node ls

# ========================
# Transferindo Arquivos para o Manager
# ========================

echo "📂 Copiando arquivos para o Manager..."
multipass transfer -r ./backend manager:/home/ubuntu/
multipass transfer -r ./frontend manager:/home/ubuntu/
multipass transfer -r ./deploy manager:/home/ubuntu/

# ========================
# Construindo as Imagens Docker no Manager
# ========================

echo "🔨 Construindo imagem do backend (auction-flask:latest)..."
multipass exec manager -- bash -c "
    cd /home/ubuntu/backend &&
    docker build -t auction-flask:latest .
"

echo "🔨 Construindo imagem do frontend (auction-frontend:latest)..."
multipass exec manager -- bash -c "
    cd /home/ubuntu/frontend &&
    docker build -t auction-frontend:latest .
"

# ========================
# Fazendo Deploy no Swarm
# ========================

echo "🚀 Fazendo deploy no Swarm..."
multipass exec manager -- bash -c "
    cd /home/ubuntu/deploy &&
    docker stack deploy -c stack.yml auction-system
"

# ========================
# Salvando e Distribuindo a Imagem do Backend para o Worker1
# ========================

echo "📦 Salvando serviço no nó worker1"
sudo docker push erikgabriel22/auction-flask:latest
sudo docker service update --image erikgabriel22/auction-flask:latest
auction-system

multipass info manager

echo -e "\n✅ Deploy finalizado!"

# ========================
# Exibindo URLs de Acesso
# ========================

MANAGER_IP=$(multipass info manager | grep IPv4 | awk '{print $2}')
WORKER1_IP=$(multipass info worker1 | grep IPv4 | awk '{print $2}')
WORKER2_IP=$(multipass info worker2 | grep IPv4 | awk '{print $2}')

# Atualiza o arquivo de configuração do frontend com a URL da API
echo "export const API_URL = 'http://$WORKER1_IP:5000';" > ./frontend/src/config.js

echo -e "\n========================="

echo -e "\n🌐 O frontend pode ser acessado em:"
echo "http://$MANAGER_IP:3000"

echo -e "\n🐍 A API Flask pode ser acessada em:"
echo "http://$WORKER1_IP:5000"

echo -e "\n📦 O Redis está disponível no endereço:"
echo "$WORKER2_IP:6379"
