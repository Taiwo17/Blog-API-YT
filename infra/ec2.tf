resource "aws_instance" "app_server" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = var.instance_type
  associate_public_ip_address = true


  vpc_security_group_ids = [
    aws_security_group.app.id
  ]

  key_name             = var.key_pair_name
  iam_instance_profile = aws_iam_instance_profile.app.name

  user_data = file("${path.module}/user-data.sh")

  root_block_device {
    volume_type           = "gp3"
    volume_size           = 20
    encrypted             = true
    delete_on_termination = true
  }

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-server"
  }
}
