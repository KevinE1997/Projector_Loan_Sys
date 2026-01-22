variable "microservices" {
  default = [
    "identity-service", "loan-service", "inventory-service",
    "feedback-service", "penalty-service", "maintenance-service",
    "audit-service", "notification-service", "dashboard-service",
    "api-gateway"
  ]
}

resource "aws_ecr_repository" "services" {
  count                = length(var.microservices)
  name                 = "plms-${var.microservices[count.index]}" # Ej: plms-identity-service
  image_tag_mutability = "MUTABLE"
  force_delete         = true # Permite destruir el repo aunque tenga imágenes (útil para labs)
}

output "ecr_url" {
  value = aws_ecr_repository.services[0].repository_url
}