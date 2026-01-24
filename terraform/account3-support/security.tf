resource "aws_security_group" "support_sg" {
  name        = "plms-support-sg"
  description = "Reglas para Support Services"
  vpc_id      = aws_vpc.main.id

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Notification Service (3006)
  ingress {
    from_port   = 3006
    to_port     = 3006
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Feedback Service (3008)
  ingress {
    from_port   = 3008
    to_port     = 3008
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Maintenance Service (3010)
  ingress {
    from_port   = 3010
    to_port     = 3010
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Audit Service (3012)
  ingress {
    from_port   = 3012
    to_port     = 3012
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Penalty Service (3016)
  ingress {
    from_port   = 3016
    to_port     = 3016
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