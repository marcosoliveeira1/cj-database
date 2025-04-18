provider "aws" {
  region = var.aws_region
}

# Grupo de Segurança para a Instância EC2
resource "aws_security_group" "app_sg" {
  name        = "app-sg-${var.aws_region}"
  description = "Permite acesso HTTP, HTTPS e SSH"

  # Permite acesso HTTP (porta 80) de qualquer lugar
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Permite acesso HTTPS (porta 443) - opcional agora, mas bom ter
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Permite acesso SSH (porta 22) a partir do CIDR definido
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_access_cidr]
  }

  # Permite todo o tráfego de saída (necessário para baixar pacotes, imagens Docker, etc.)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # Representa todos os protocolos
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "app-security-group"
  }
}

# Instância EC2
resource "aws_instance" "app_server" {
  ami           = var.ami_id
  instance_type = var.instance_type
  key_name      = var.key_name # Nome da sua chave SSH criada manualmente

  # Associa o Security Group criado acima
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  # User Data: Script executado na primeira inicialização da instância
  # Instala Docker, Docker Compose e Git
  user_data = <<-EOF
            #!/bin/bash
            # Use yum para Amazon Linux 2
            apt update -y
            apt upgrade -y
            # Add Docker's official GPG key:
            apt install -y ca-certificates curl
            install -m 0755 -d /etc/apt/keyrings
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
            chmod a+r /etc/apt/keyrings/docker.asc

            # Add the repository to Apt sources:
            echo \
              "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
              $(. /etc/os-release && echo "$${UBUNTU_CODENAME:-$$VERSION_CODENAME}") stable" | \
              sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            apt update

            apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

            systemctl start docker
            usermod -a -G docker ubuntu # Adiciona o usuário padrão ao grupo docker
            systemctl enable docker

            ## Instala Docker Compose V2 (recomendado)
            # DOCKER_CONFIG=$${{DOCKER_CONFIG:-$$HOME/.docker}
            # mkdir -p $DOCKER_CONFIG/cli-plugins
            # curl -SL https://github.com/docker/compose/releases/download/v2.17.2/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
            # chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose

            # Habilita IP Forwarding (pode ser necessário para redes Docker)
            # sysctl -w net.ipv4.ip_forward=1
            # echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf

            # (Opcional) Cria diretório para a aplicação
            # mkdir /home/ubuntu/app
            # chown ubuntu:ubuntu /home/ubuntu/app
            EOF

  tags = {
    Name = "AppServerNodeJS"
  }
}
