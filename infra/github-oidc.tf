data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}


resource "aws_iam_role" "github_deploy" {
  name = "${var.project_name}-${var.environment}-github-deploy-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow",

        Principal = {
          Federated = data.aws_iam_openid_connect_provider.github.arn
        },

        Action = "sts:AssumeRoleWithWebIdentity",

        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com",
            "token.actions.githubusercontent.com:sub" = "repo:Taiwo17/Blog-API-YT:ref:refs/heads/master"
          }
        }

      }
    ]
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-github-deploy-role"
  }
}


resource "aws_iam_role_policy" "github_deploy" {
  name = "${var.project_name}-${var.environment}-github-deploy-policy"
  role = aws_iam_role.github_deploy.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Sid    = "SendDeploymentCommand"
        Effect = "Allow"

        Action = [
          "ssm:SendCommand"
        ]

        Resource = [
          aws_instance.app_server.arn,
          "arn:aws:ssm:${var.aws_region}::document/AWS-RunShellScript"
        ]
      },

      {
        Sid    = "ReadDeploymentCommandResult"
        Effect = "Allow"

        Action = [
          "ssm:GetCommandInvocation"
        ]

        Resource = "*"
      }

    ]
  })
}
