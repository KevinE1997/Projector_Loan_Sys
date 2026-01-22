# Buscar imagen Amazon Linux 2
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# Plantilla de Lanzamiento (Launch Template)
resource "aws_launch_template" "gateway_lt" {
  name_prefix   = "plms-gateway-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = "t2.micro"

  # Asignamos el Security Group de Instancias
  vpc_security_group_ids = [aws_security_group.instance_sg.id]

  # Script de inicio (User Data): Instala Nginx automáticamente al prenderse
user_data = base64encode(<<-EOF
              #!/bin/bash
              yum update -y
              amazon-linux-extras install nginx1 -y
              
              # --- CONFIGURACIÓN DE NGINX ---
              cat <<EOT > /etc/nginx/nginx.conf
              user nginx;
              worker_processes auto;
              error_log /var/log/nginx/error.log;
              pid /run/nginx.pid;

              events {
                  worker_connections 1024;
              }

              http {
                  log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                                    '$status $body_bytes_sent "$http_referer" '
                                    '"$http_user_agent" "$http_x_forwarded_for"';

                  access_log  /var/log/nginx/access.log  main;
                  sendfile            on;
                  tcp_nopush          on;
                  tcp_nodelay         on;
                  keepalive_timeout   65;
                  types_hash_max_size 2048;
                  include             /etc/nginx/mime.types;
                  default_type        application/octet-stream;

                  server {
                      listen       80;
                      server_name  _;

                      # Ruta de prueba
                      location / {
                          return 200 '<h1>PLMS API Gateway Online 🚀</h1><p>Conectado a Accounts 2 & 3</p>';
                          add_header Content-Type text/html;
                      }

                      # --- RUTAS HACIA LA CUENTA 2 (CORE SERVICES) ---
                      # Reemplaza IP_CUENTA_2 con la IP real (Ej: 34.200.x.x)
                      
                      # Identity Service
                      location /api/auth {
                          proxy_pass http://174.129.245.238:3000/api/auth;
                          proxy_set_header Host \$host;
                      }
                      location /api/users {
                          proxy_pass http://174.129.245.238:3000/api/users;
                          proxy_set_header Host \$host;
                      }

                      # Inventory Service
                      location /api/projectors {
                          proxy_pass http://174.129.245.238:3002/api/projectors;
                          proxy_set_header Host \$host;
                      }

                      # Loan Service
                      location /api/loans {
                          proxy_pass http://174.129.245.238:3004/api/loans;
                          proxy_set_header Host \$host;
                      }

                      # --- RUTAS HACIA LA CUENTA 3 (SUPPORT SERVICES) ---
                      # Reemplaza IP_CUENTA_3 con la IP real (Ej: 54.100.x.x)

                      # Notification Service
                      location /api/notifications {
                          proxy_pass http://54.164.222.192:3006/api/notifications;
                          proxy_set_header Host \$host;
                      }

                      # Feedback Service
                      location /api/feedback {
                          proxy_pass http://54.164.222.192:3008/api/feedback;
                          proxy_set_header Host \$host;
                      }

                      # Maintenance Service
                      location /api/maintenance {
                          proxy_pass http://54.164.222.192:3010/api/maintenance;
                          proxy_set_header Host \$host;
                      }

                      # Penalty Service
                      location /api/penalties {
                          proxy_pass http://54.164.222.192:3016/api/penalties;
                          proxy_set_header Host \$host;
                      }
                      
                      # Dashboard (Websockets) - Este vive aquí mismo en el Gateway o en Core
                      # Por ahora lo dejaremos pendiente o lo dirigimos al Core si decides correrlo allá.
                  }
              }
              EOT
              # ------------------------------

              systemctl start nginx
              systemctl enable nginx
              # Recargar por si acaso
              systemctl restart nginx
              EOF
  )

  tag_specifications {
    resource_type = "instance"
    tags = { Name = "PLMS-Gateway-Instance" }
  }
}

# El Grupo de Autoescalado
resource "aws_autoscaling_group" "bar" {
  desired_capacity    = 1 # Empezamos con 1
  max_size            = 3 # Podemos subir hasta 3 si hay carga
  min_size            = 1
  vpc_zone_identifier = [aws_subnet.public_a.id, aws_subnet.public_b.id]
  target_group_arns   = [aws_lb_target_group.main_tg.arn] # Conectar al ELB

  launch_template {
    id      = aws_launch_template.gateway_lt.id
    version = "$Latest"
  }
}