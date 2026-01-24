# Buscar la última imagen de Ubuntu automáticamente
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# Crear par de llaves SSH (Esto creará un archivo .pem localmente)
resource "tls_private_key" "pk" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "kp" {
  key_name   = "plms-key"       # Nombre de la llave en AWS
  public_key = tls_private_key.pk.public_key_openssh
}

resource "local_file" "ssh_key" {
  filename        = "${path.module}/plms-key.pem"
  content         = tls_private_key.pk.private_key_pem
  file_permission = "0400"
}

# Instancia EC2 (Bastion)
resource "aws_instance" "bastion" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t2.micro" # Capa gratuita
  subnet_id     = aws_subnet.public_a.id
  
  vpc_security_group_ids = [aws_security_group.bastion_sg.id]
  key_name               = aws_key_pair.kp.key_name

  tags = {
    Name = "plms-Bastion-Host"
    Role = "JumpBox"
  }
}

# Output: Nos dirá la IP para conectarnos
output "bastion_ip" {
  value = aws_instance.bastion.public_ip
}