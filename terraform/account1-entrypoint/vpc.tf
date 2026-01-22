# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "plms-acc1-vpc" }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
}

# Subnets Públicas (Para ELB y Bastion)
resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
}

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true
}

# Subnet Privada (Para Kafka y Gateway Instances)
resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "us-east-1a"
}

# Route Table Pública
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "pub_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}
resource "aws_route_table_association" "pub_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}

# NAT Gateway (o NAT Instance) para la privada. 
# NOTA: Por presupuesto $50, usamos NAT Instance como vimos antes.
# (He omitido el código de NAT Instance aquí para no hacerlo gigante, pero debes incluirlo
# o poner las instancias Gateway en la subnet pública si quieres ahorrar máximo).
# ---> ESTRATEGIA AHORRO EXTREMO: Pondremos el ASG en la Subnet PÚBLICA.
# Es menos "purista" en seguridad, pero te ahorra configurar la NAT y es aceptable académicamente.