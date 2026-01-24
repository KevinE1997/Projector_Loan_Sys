provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      Project = "PLMS"
      Env     = "Account-1-Gateway"
    }
  }
}