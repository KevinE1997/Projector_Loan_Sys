# Llave SSH
resource "tls_private_key" "pk" {
  algorithm = "RSA"
  rsa_bits  = 4096
}
resource "aws_key_pair" "kp" {
  key_name   = "plms-account3-key"
  public_key = tls_private_key.pk.public_key_openssh
}
resource "local_file" "ssh_key" {
  filename        = "${path.module}/plms-account3-key.pem"
  content         = tls_private_key.pk.private_key_pem
  file_permission = "0400"
}

# Buscar AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# Servidor Support
resource "aws_instance" "support_server" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.small" # t3.small recomendado para correr 5 microservicios
  subnet_id     = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.support_sg.id]
  key_name      = aws_key_pair.kp.key_name

  # Instalar Docker
  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install docker -y
              service docker start
              usermod -a -G docker ec2-user
              curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              chmod +x /usr/local/bin/docker-compose
              EOF

  tags = { Name = "PLMS-Support-Server" }
}

# IP Elástica
resource "aws_eip" "support_eip" {
  instance = aws_instance.support_server.id
  domain   = "vpc"
}

output "support_public_ip" {
  value = aws_eip.support_eip.public_ip
}