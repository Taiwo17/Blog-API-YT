# Blog API

A containerized REST API built with Node.js, Express, and MongoDB. The project includes automated testing, Docker image publishing, AWS infrastructure managed with Terraform, and continuous deployment to Amazon EC2 through GitHub Actions and AWS Systems Manager.

## Project Overview

The Blog API provides the backend foundation for a blogging application. It runs as a Docker container and connects to a MongoDB container through a private Docker Compose network.

The deployment workflow follows this process:

```text
Push to master
    → Run automated tests
    → Build the Docker image
    → Push commit-tagged image to Docker Hub
    → Authenticate to AWS with GitHub OIDC
    → Deploy to EC2 through AWS Systems Manager
    → Verify application health
```

## Technology Stack

| Technology | Purpose |
| --- | --- |
| Node.js 22 | JavaScript runtime |
| Express | Web application framework |
| MongoDB 8 | Application database |
| Mongoose | MongoDB object modelling |
| Docker | Application containerization |
| Docker Compose | Application and database orchestration |
| Terraform | AWS infrastructure provisioning |
| Amazon EC2 | Application hosting |
| AWS Systems Manager | Remote deployment execution |
| AWS IAM and OIDC | Secure GitHub-to-AWS authentication |
| GitHub Actions | Continuous integration and deployment |
| Docker Hub | Docker image registry |

## Features

- Express REST API structure
- MongoDB database connection with Mongoose
- JSON request handling
- Centralized routing
- 404 route handling
- Centralized error handling
- Dockerized application environment
- Persistent MongoDB storage
- MongoDB container health check
- Automated tests with GitHub Actions
- Commit-specific Docker image tags
- Infrastructure as code with Terraform
- Keyless AWS authentication with GitHub OIDC
- Automated EC2 deployment through Systems Manager
- Deployment health checks and failure logs

## Repository Structure

```text
Blog-API-YT/
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── controllers/
├── database/
├── infra/
│   ├── data.tf
│   ├── ec2.tf
│   ├── github-oidc.tf
│   ├── iam.tf
│   ├── network.tf
│   ├── outputs.tf
│   ├── provider.tf
│   ├── security-group.tf
│   ├── terraform.tfvars.example
│   ├── user-data.sh
│   ├── variables.tf
│   └── versions.tf
├── middleware/
├── models/
├── routes/
├── tests/
├── uploads/
├── utils/
├── validator/
├── Dockerfile
├── docker-compose.yml
├── package-lock.json
├── package.json
├── server.js
└── README.md
```

Terraform automatically reads all `.tf` files inside the `infra` directory as one configuration.

## Prerequisites

Install the following before running the project locally:

- Git
- Node.js 22 or later
- npm
- Docker
- Docker Compose

Terraform and the AWS CLI are additionally required for infrastructure deployment.

## Environment Variables

Create a `.env` file in the project root. Do not commit this file.

```dotenv
NODE_ENV=development
PORT=5000
DOCKERHUB_USERNAME=your-dockerhub-username
IMAGE_TAG=latest
MONGO_USER=blogadmin
MONGO_PASSWORD=replace-with-a-strong-password
MONGO_DB=blog_api
JWT_SECRET=replace-with-a-long-random-secret
```

When the application runs through Docker Compose, its MongoDB connection uses the Compose service name `db` instead of `localhost`:

```text
mongodb://MONGO_USER:MONGO_PASSWORD@db:27017/MONGO_DB?authSource=admin
```

Use different credentials and secrets for development, testing, and production.

## Local Installation

Clone the repository:

```bash
git clone https://github.com/Taiwo17/Blog-API-YT.git
cd Blog-API-YT
```

Install the Node.js dependencies:

```bash
npm ci
```

Create the `.env` file, then start the application according to the scripts defined in `package.json`:

```bash
npm run dev
```

The API should be available at:

```text
http://localhost:5000
```

## Running with Docker Compose

Build and start the services:

```bash
docker compose up -d --build
```

Check their status:

```bash
docker compose ps
```

View the application logs:

```bash
docker compose logs -f app
```

Test the home route:

```bash
curl http://localhost:5000
```

Expected response:

```json
{
  "message": "This is the home route"
}
```

Stop the services without deleting the database volume:

```bash
docker compose down
```

> Running `docker compose down -v` deletes the MongoDB volume and its stored data. Use it only when the data is no longer required.

## Running Tests

Run the automated test suite with:

```bash
npm test
```

The GitHub Actions test job starts a temporary MongoDB 8 service and uses:

```text
mongodb://localhost:27017/blog_api_test
```

The image build and deployment jobs run only after the tests pass.

## Docker Image Tags

For every push to `master`, GitHub Actions publishes the application image to Docker Hub with these tags:

```text
latest
master
sha-FULL_GITHUB_COMMIT_SHA
```

Production deployment uses the immutable SHA tag:

```yaml
IMAGE_TAG: sha-${{ github.sha }}
```

This makes it possible to identify the exact Git commit running on the server.

## AWS Infrastructure

Terraform provisions and manages the following resources:

- Amazon Linux EC2 instance
- EC2 security group
- Encrypted `gp3` root volume
- EC2 IAM role and instance profile
- AWS Systems Manager permissions
- GitHub Actions deployment role
- GitHub OIDC trust configuration
- Infrastructure outputs such as the public IP and instance ID

The current deployment uses:

```text
AWS region: us-east-1
Instance type: t3.micro
Application port: 5000
Environment: production
```

### Terraform configuration

Create `infra/terraform.tfvars` from the example file:

```hcl
aws_region       = "us-east-1"
project_name     = "blog-api"
environment      = "production"
instance_type    = "t3.micro"
application_port = 5000
key_pair_name    = "blog_api_key"
ssh_allowed_cidr = "YOUR_PUBLIC_IP/32"
```

Do not commit `terraform.tfvars`, Terraform state files, PEM files, or secret values.

Initialize and validate the configuration:

```bash
cd infra
terraform fmt
terraform init
terraform validate
```

Review and apply the infrastructure changes:

```bash
terraform plan -out=tfplan
terraform apply tfplan
```

Display the infrastructure outputs:

```bash
terraform output
```

## Manual EC2 Deployment

The application is deployed under:

```text
/opt/blog-api
```

To connect with the downloaded EC2 key:

```bash
ssh -i ~/.ssh/blog_api_key.pem ec2-user@EC2_PUBLIC_IP
```

The PEM file must remain outside the repository.

On EC2, the manual deployment commands are:

```bash
cd /opt/blog-api
git pull --ff-only origin master
docker compose pull
docker compose up -d --remove-orphans
docker compose ps
curl http://localhost:5000
```

## CI/CD Pipeline

The workflow is defined in:

```text
.github/workflows/ci-cd.yml
```

It contains three jobs:

1. `test` installs the dependencies and tests the application with MongoDB.
2. `build-and-push` creates the Docker image and publishes it to Docker Hub.
3. `deploy` assumes an AWS role and deploys the image to EC2 through Systems Manager.

Pull requests run the test job only. A push to `master` runs the complete pipeline.

### GitHub Actions secrets

Configure these under **Repository → Settings → Secrets and variables → Actions → Secrets**:

| Secret | Purpose |
| --- | --- |
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token used to publish images |

### GitHub Actions variables

Configure these under **Repository → Settings → Secrets and variables → Actions → Variables**:

| Variable | Purpose |
| --- | --- |
| `AWS_ROLE_ARN` | ARN of the GitHub deployment IAM role |
| `AWS_REGION` | AWS region, currently `us-east-1` |
| `EC2_INSTANCE_ID` | ID of the production EC2 instance |

The AWS values can be obtained from Terraform:

```bash
terraform output -raw github_deploy_role_arn
terraform output -raw instance_id
```

## Deployment Authentication

GitHub Actions authenticates to AWS through OpenID Connect. The workflow requests an identity token and exchanges it for temporary AWS credentials.

This approach avoids storing permanent AWS access keys in GitHub. The IAM trust policy restricts access to this repository and the `master` branch, while the permissions policy limits the role to the required Systems Manager deployment operations.

The EC2 PEM private key is not used by the CI/CD pipeline.

## Deployment Health Check

After recreating the application container, the workflow checks:

```text
http://localhost:5000
```

The health check retries for up to 60 seconds because a newly started application may need time to connect to MongoDB. If the API does not become ready, the deployment fails and returns the application logs to GitHub Actions.

## Verifying a Deployment

Open **GitHub → Actions → BlogAPI-CI/CD** and confirm that all three jobs passed.

On EC2, run:

```bash
cd /opt/blog-api
docker compose ps
docker compose images
docker compose logs --tail=100 app
curl http://localhost:5000
```

The public application is currently available through:

```text
http://EC2_PUBLIC_IP:5000
```

Do not place a temporary EC2 address in this README because it can change when the instance is replaced. An Elastic IP or domain should be used for a stable production address.

## Security Practices

- Never commit `.env`, `terraform.tfvars`, Terraform state, or PEM files.
- Restrict SSH port `22` to the administrator's public IP.
- Do not expose MongoDB port `27017` publicly.
- Use GitHub OIDC instead of permanent AWS access keys.
- Use least-privilege IAM policies.
- Use separate strong production secrets.
- Deploy immutable SHA-tagged images.
- Keep the Docker Hub token in the build job instead of sending it through Systems Manager.

## Current Deployment Status

The Blog API has been manually verified on EC2. Docker and Docker Compose are running, MongoDB is healthy, and the home endpoint returns a successful response. The GitHub Actions workflow tests the application, publishes a commit-specific Docker image, and deploys it to EC2 through AWS Systems Manager.

## Planned Improvements

- Allocate and attach an Elastic IP.
- Configure Nginx as a reverse proxy.
- Connect a domain name.
- Enable HTTPS.
- Remove public access to port `5000` after Nginx is configured.
- Move production secrets to AWS Parameter Store or Secrets Manager.
- Move Terraform state to an encrypted remote backend.
- Add CloudWatch logs, metrics, and alarms.
- Add automated MongoDB backups.
- Add deployment rollback and a staging environment.
- Migrate to Amazon ECR and ECS/Fargate as the project grows.

## Author

Developed and deployed by [Taiwo17](https://github.com/Taiwo17).

## License

This project is licensed under the ISC License.
