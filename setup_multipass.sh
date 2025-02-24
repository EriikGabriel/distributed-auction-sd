#!/bin/bash
set -e

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
# Atualizando Config do Frontend
# ========================
echo "🔄 Atualizando config.js do frontend..."
WORKER1_IP=$(multipass info worker1 | grep IPv4 | awk '{print $2}')

echo "export const API_URL = 'http://$WORKER1_IP:5000';" > ./frontend/src/config.js
echo "✅ Configuração do frontend atualizada!"

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

echo "🔨 Recriando a imagem do frontend após a atualização do config.js..."
multipass exec manager -- bash -c "
    cd /home/ubuntu/frontend &&
    docker build --no-cache -t auction-frontend:latest .
"

# ========================
# Salvando a imagem do backend para distribuição
# ========================

echo "💾 Salvando a imagem do backend em um arquivo na VM manager..."
multipass exec manager -- bash -c "docker save auction-flask:latest -o /home/ubuntu/auction-flask.tar"

echo "🚚 Transferindo o arquivo de imagem da VM manager para a máquina host..."
multipass transfer manager:/home/ubuntu/auction-flask.tar .

echo "🚚 Transferindo a imagem para worker1 e worker2..."
multipass transfer auction-flask.tar worker1:/home/ubuntu/
multipass transfer auction-flask.tar worker2:/home/ubuntu/

echo "🔄 Importando a imagem nos workers..."
multipass exec worker1 -- bash -c "docker load -i /home/ubuntu/auction-flask.tar"
multipass exec worker2 -- bash -c "docker load -i /home/ubuntu/auction-flask.tar"

# ========================
# Fazendo Deploy no Swarm
# ========================

echo "🚀 Fazendo deploy no Swarm..."
multipass exec manager -- bash -c "
    cd /home/ubuntu/deploy &&
    docker stack deploy -c stack.yml auction-system
"

echo "🔄 Atualizando o serviço do backend com a nova imagem..."
multipass exec manager -- bash -c "docker service update --image auction-flask:latest auction-system_backend"

multipass info manager
echo -e "\n✅ Deploy finalizado!"

# ========================
# Exibindo URLs de Acesso
# ========================

MANAGER_IP=$(multipass info manager | grep IPv4 | awk '{print $2}')
WORKER1_IP=$(multipass info worker1 | grep IPv4 | awk '{print $2}')
WORKER2_IP=$(multipass info worker2 | grep IPv4 | awk '{print $2}')

echo -e "\n========================="

echo -e "\n🌐 O frontend pode ser acessado em:"
echo "http://$MANAGER_IP:3000"

echo -e "\n🐍 A API Flask pode ser acessada em:"
echo "http://$WORKER1_IP:5000"

echo -e "\n📦 O Redis está disponível no endereço:"
echo "$WORKER2_IP:6379"
