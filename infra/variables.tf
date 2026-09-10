variable "aws_region" {
  description = "AWS region used for deployment"
  type        = string
  default     = "us-east-1"
}


variable "project_name" {
  description = "Project name"
  type        = string
  default     = "blog_api"
}


variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}


variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "application_port" {
  description = "Port used by Nodejs application"
  type        = number
  default     = 5000

}

variable "key_pair_name" {
  description = "Existing EC2 key pair name"
  type        = string
}


variable "ssh_allowed_cidr" {
  description = "Public IP address allowed to use SSH"
  type        = string
}

