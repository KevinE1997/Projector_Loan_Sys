variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
  default     = "plms"
}

variable "environment" {
  description = "Entorno de despliegue (qa, prod)"
  type        = string
}

variable "vpc_cidr" {
  description = "Rango de IP para la VPC"
  type        = string
  default     = "10.0.0.0/16"
}