# 1. Security Group del Load Balancer (ELB)
resource "aws_security_group" "elb_sg" {
  name        = "plms-elb-sg"
  description = "Permitir HTTP desde todo el mundo"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 2. Security Group de las Instancias (ASG)
resource "aws_security_group" "instance_sg" {
  name        = "plms-instance-sg"
  description = "Solo trafico del ELB y SSH del Bastion"
  vpc_id      = aws_vpc.main.id

  # HTTP solo desde el Load Balancer
  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.elb_sg.id]
  }
  
  # SSH desde cualquier lado (Temporal, idealmente solo Bastion)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] 
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}