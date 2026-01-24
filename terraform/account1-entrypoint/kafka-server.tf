resource "aws_instance" "kafka" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.small" # Kafka necesita RAM
  subnet_id     = aws_subnet.public_a.id # Pública para simplificar conexión multi-cuenta
  vpc_security_group_ids = [aws_security_group.instance_sg.id]
  key_name = aws_key_pair.kp.key_name
  
  tags = { Name = "PLMS-Kafka-Broker" }
}

# Elastic IP para Kafka (CRÍTICO: Las otras cuentas necesitan IP fija para conectar)
resource "aws_eip" "kafka_eip" {
  instance = aws_instance.kafka.id
  domain   = "vpc"
}

output "kafka_public_ip" {
  value = aws_eip.kafka_eip.public_ip
}