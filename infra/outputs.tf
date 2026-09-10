output "instance_id" {
  description = "EC2 instance id"
  value       = aws_instance.app_server.id
}


output "public_ip" {
  description = "EC2 public ip"
  value       = aws_instance.app_server.public_ip
}

output "public_dns" {
  description = "EC2 public DNS"
  value       = aws_instance.app_server.public_dns
}

output "application_url" {
  description = "Public  application URL"
  value       = "http://${aws_instance.app_server.public_ip}:${var.application_port}"
}

output "ssh_command" {
  description = "Command used to connect through SSH"
  value       = "ssh -i ~/.ssh/blog_api_key.pem ec2-user@${aws_instance.app_server.public_ip}"
}


output "github_deploy_role_arn" {
  description = "IAM role assumed by GitHub Action"
  value       = aws_iam_role.github_deploy.arn
}
