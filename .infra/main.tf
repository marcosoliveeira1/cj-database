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

  # Permite acesso MySQL (porta 3306) a partir do CIDR definido
  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = [var.mysql_access_cidr]
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

  root_block_device {
    volume_size = var.root_volume_size
    volume_type = var.root_volume_type
  }

  # User Data: Script executado na primeira inicialização da instância
  user_data = file("./infra/setup.sh")

  tags = {
    Name = "AppServerNodeJS"
  }
}
