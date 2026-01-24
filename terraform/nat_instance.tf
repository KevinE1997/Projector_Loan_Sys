# 1. BUSCAR AUTOMÁTICAMENTE LA ÚLTIMA AMI DE AMAZON LINUX 2
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# 2. Security Group para la NAT Instance
resource "aws_security_group" "nat_sg" {
  name        = "${var.project_name}-${var.environment}-nat-sg"
  description = "Permitir trafico desde la red privada"
  vpc_id      = aws_vpc.main.id

  # Entrada: Todo el tráfico que venga desde las Subnets Privadas
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["10.0.10.0/24", "10.0.11.0/24"] # Asegúrate que coincida con tus subnets privadas
  }

  # Salida: Todo hacia internet
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-nat-sg"
  }
}

# 3. La Instancia NAT (Usando el ID dinámico encontrado arriba)
resource "aws_instance" "nat_instance" {
  ami           = data.aws_ami.amazon_linux.id # <--- AQUÍ ESTÁ EL CAMBIO CLAVE
  instance_type = "t2.micro"                   
  subnet_id     = aws_subnet.public_a.id       
  
  vpc_security_group_ids = [aws_security_group.nat_sg.id]
  key_name               = aws_key_pair.kp.key_name
  
  # CRÍTICO: Desactivar chequeo de origen/destino para actuar como router
  source_dest_check = false 

  # Script de inicio para configurar IPTables (Router)
  user_data = <<-EOF
              #!/bin/bash
              sysctl -w net.ipv4.ip_forward=1
              /sbin/iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
              yum install -y iptables-services
              service iptables save
              EOF

  tags = {
    Name = "${var.project_name}-${var.environment}-nat-instance"
  }
}