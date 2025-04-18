output "instance_public_ip" {
  description = "Endereço IP público da instância EC2"
  value       = aws_instance.app_server.public_ip
}

output "instance_public_dns" {
  description = "DNS público da instância EC2"
  value       = aws_instance.app_server.public_dns
}

output "ssh_command" {
  description = "Comando para conectar via SSH"
  # value       = "ssh -i ~/.ssh/cj-aws-key.pem ubuntu@${aws_instance.app_server.public_dns}"
  value = "ssh -i ~/.ssh/cj-aws-key ubuntu@${aws_instance.app_server.public_dns}"
  # Lembre-se de trocar SUA_CHAVE_PRIVADA.pem pelo caminho do seu arquivo .pem
  # E use 'ubuntu@...' se estiver usando uma AMI Ubuntu
}
