provider "aws" {
  region = "us-east-1"

  # Etiquetas dinámicas
  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      Owner       = "KevinEndara"
      ManagedBy   = "Terraform"
    }
  }
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}