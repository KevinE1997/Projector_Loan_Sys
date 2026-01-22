resource "aws_lb" "main_alb" {
  name               = "plms-gateway-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.elb_sg.id]
  # El ELB necesita vivir en al menos 2 zonas públicas
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]

  tags = { Name = "PLMS-ALB" }
}

resource "aws_lb_target_group" "main_tg" {
  name     = "plms-gateway-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path = "/" # Nginx responderá en la raíz
  }
}

resource "aws_lb_listener" "front_end" {
  load_balancer_arn = aws_lb.main_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main_tg.arn
  }
}