resource "aws_security_group" "core_sg" {
  name        = "plms-core-sg"
  description = "Reglas para Core Services"
  vpc_id      = aws_vpc.main.id

  # SSH (Para GitHub Actions / Tú)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Identity Service (3000)
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Idealmente restringir a la IP del Gateway (Cuenta 1)
  }

  # Inventory Service (3002)
  ingress {
    from_port   = 3002
    to_port     = 3002
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Loan Service (3004)
  ingress {
    from_port   = 3004
    to_port     = 3004
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