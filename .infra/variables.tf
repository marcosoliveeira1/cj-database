variable "aws_region" {
  description = "Região AWS para criar os recursos"
  type        = string
  default     = "sa-east-1"
}

variable "instance_type" {
  description = "Tipo da instância EC2 (Free Tier eligible)"
  type        = string
  default     = "t2.micro"
}

variable "ami_id" {
  description = "ID da AMI (Amazon Machine Image) - Use uma AMI Amazon Linux 2 ou Ubuntu compatível com Free Tier"
  type        = string
  default     = "ami-0d866da98d63e2b42"
}

variable "key_name" {
  description = "Nome do par de chaves SSH existente na AWS para acesso à instância"
  type        = string
  # Ex: "meu-par-de-chaves-app" - Substitua pelo nome da sua chave
  default = "cj-aws-key"
}

variable "ssh_access_cidr" {
  description = "Bloco CIDR permitido para acesso SSH (seu IP / 0.0.0.0/0 para qualquer IP - CUIDADO!)"
  type        = string
  default     = "0.0.0.0/0"
}


variable "root_volume_type"{
  description = "Tipo do volume raiz (gp2, gp3, etc.)"
  type        = string
  default     = "gp3"
}

variable "root_volume_size" {
  description = "Tamanho do volume raiz em GB"
  type        = number
  default     = 30
}

variable "mysql_access_cidr" {
  description = "Bloco CIDR permitido para acesso MySQL (seu IP / 0.0.0.0/0 para qualquer IP - CUIDADO!)"
  type        = string
  default     = "0.0.0.0/0"
}