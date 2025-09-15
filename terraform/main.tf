# Arabic Recognition App - Main Terraform Configuration
# This file defines the core infrastructure for the Arabic Recognition App

  # Backend configuration should be uncommented and configured for production
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket"
  #   key            = "arabic-recognition-app/terraform.tfstate"
  #   region         = "eu-west-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-state-lock"
  # }

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment   = var.environment
      Project       = var.project_name
      ManagedBy     = "Terraform"
      Repository    = var.repository_url
      Owner         = var.project_owner
    }
  }
}

# Data sources for existing AWS resources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
  filter {
    name   = "default-for-az"
    values = ["true"]
  }
}

# Generate unique resource names to avoid conflicts
locals {
  resource_name_prefix = "${var.project_name}-${var.environment}"
}

# Reference existing ECR Repository (created outside of Terraform)
data "aws_ecr_repository" "app_repository" {
  name = var.ecr_repository_name
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/ecs/${var.project_name}"
  retention_in_days = var.log_retention_days
  kms_key_id        = aws_kms_key.logs_key.arn

  tags = merge(local.common_tags, {
    Name = "${local.resource_name_prefix}-logs"
  })
}

# KMS Key for log encryption
resource "aws_kms_key" "logs_key" {
  description             = "KMS key for ${var.project_name} log encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "Allow CloudWatch Logs"
        Effect = "Allow"
        Principal = {
          Service = "logs.${data.aws_region.current.name}.amazonaws.com"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ]
        Resource = "*"
      }
    ]
  })

  tags = merge(local.common_tags, {
    Name = "${local.resource_name_prefix}-logs-kms-key"
  })
}

resource "aws_kms_alias" "logs_key_alias" {
  name          = "alias/${local.resource_name_prefix}-logs"
  target_key_id = aws_kms_key.logs_key.key_id
}

# Security Groups
resource "aws_security_group" "alb_sg" {
  name_prefix = "${local.resource_name_prefix}-alb-"
  vpc_id      = data.aws_vpc.default.id
  description = "Security group for ${var.project_name} Application Load Balancer"

  # HTTPS traffic from internet
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP traffic from internet (for redirect to HTTPS)
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # All outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${local.resource_name_prefix}-alb-sg"
  })
}

resource "aws_security_group" "ecs_sg" {
  name_prefix = "${local.resource_name_prefix}-ecs-"
  vpc_id      = data.aws_vpc.default.id
  description = "Security group for ${var.project_name} ECS tasks"

  # Allow traffic from ALB only
  ingress {
    description     = "HTTP from ALB"
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  # All outbound traffic (required for pulling images, etc.)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${local.resource_name_prefix}-ecs-sg"
  })
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${local.resource_name_prefix}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = data.aws_subnets.default.ids

  enable_deletion_protection = var.enable_deletion_protection
  enable_http2              = true
  enable_cross_zone_load_balancing = true

  access_logs {
    bucket  = var.alb_access_logs_bucket
    enabled = var.alb_access_logs_bucket != "" ? true : false
    prefix  = "${var.project_name}-alb"
  }

  tags = merge(local.common_tags, {
    Name = "${local.resource_name_prefix}-alb"
  })
}

# Target Group
resource "aws_lb_target_group" "app" {
  name        = "${local.resource_name_prefix}-tg"
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = var.health_check_path
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 3
  }

  # Enable connection draining
  deregistration_delay = 30

  tags = merge(local.common_tags, {
    Name = "${local.resource_name_prefix}-tg"
  })
}

# SSL Certificate (if domain is provided)
resource "aws_acm_certificate" "main" {
  count             = var.domain_name != "" ? 1 : 0
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = var.subject_alternative_names

  lifecycle {
    create_before_destroy = true
  }

  tags = merge(local.common_tags, {
    Name = "${local.resource_name_prefix}-ssl-certificate"
  })
}

# ==========================================
# Route 53 DNS Configuration (HTTPS Setup)
# ==========================================
# This section creates:
# 1. Hosted Zone - Manages DNS for your domain
# 2. Certificate Validation Records - Auto-validates SSL certificate
# 3. Certificate Validation Waiter - Waits for certificate to be validated
# 4. A Record - Points your domain to the ALB
#
# IMPORTANT: After deployment, configure your domain registrar to use
# the name servers from the 'route53_name_servers' output (if creating new zone).

# Route 53 Hosted Zone - Use existing or create new
resource "aws_route53_zone" "main" {
  count = var.domain_name != "" && var.route53_zone_id == "" ? 1 : 0
  name  = var.domain_name

  tags = merge(local.common_tags, {
    Name = "${local.resource_name_prefix}-hosted-zone"
  })
}

# Reference existing Route 53 hosted zone (if provided)
data "aws_route53_zone" "existing" {
  count   = var.domain_name != "" && var.route53_zone_id != "" ? 1 : 0
  zone_id = var.route53_zone_id
}

# Local values to determine which zone to use
locals {
  route53_zone_id = var.domain_name != "" ? (
    var.route53_zone_id != "" ? data.aws_route53_zone.existing[0].zone_id : aws_route53_zone.main[0].zone_id
  ) : null
}

# Certificate validation DNS records
resource "aws_route53_record" "cert_validation" {
  for_each = var.domain_name != "" ? {
    for dvo in aws_acm_certificate.main[0].domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  } : {}

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = local.route53_zone_id
}

# Certificate validation waiter
resource "aws_acm_certificate_validation" "main" {
  count           = var.domain_name != "" ? 1 : 0
  certificate_arn = aws_acm_certificate.main[0].arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]

  timeouts {
    create = "5m"
  }
}

# A record pointing domain to ALB
resource "aws_route53_record" "app" {
  count   = var.domain_name != "" ? 1 : 0
  zone_id = local.route53_zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

# HTTPS Listener (if SSL certificate exists)
resource "aws_lb_listener" "https" {
  count             = var.domain_name != "" ? 1 : 0
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = aws_acm_certificate_validation.main[0].certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }

  depends_on = [aws_acm_certificate_validation.main]
}

# HTTP Listener (redirect to HTTPS if certificate exists, otherwise forward)
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = var.domain_name != "" ? "redirect" : "forward"

    dynamic "redirect" {
      for_each = var.domain_name != "" ? [1] : []
      content {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }

    dynamic "forward" {
      for_each = var.domain_name == "" ? [1] : []
      content {
        target_group {
          arn = aws_lb_target_group.app.arn
        }
      }
    }
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${local.resource_name_prefix}-cluster"

  configuration {
    execute_command_configuration {
      logging = "OVERRIDE"
      log_configuration {
        cloud_watch_log_group_name = aws_cloudwatch_log_group.app_logs.name
      }
    }
  }

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = merge(local.common_tags, {
    Name = "${local.resource_name_prefix}-cluster"
  })
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE"
  }
}

# IAM Roles for ECS
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${local.resource_name_prefix}-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(local.common_tags, {
    Name = "${local.resource_name_prefix}-ecs-task-execution-role"
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "ecs_task_execution_role_additional" {
  name = "${local.resource_name_prefix}-ecs-task-execution-additional"
  role = aws_iam_role.ecs_task_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ]
        Resource = aws_kms_key.logs_key.arn
      }
    ]
  })
}

resource "aws_iam_role" "ecs_task_role" {
  name = "${local.resource_name_prefix}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  # Add any additional permissions your app needs here
  # For example, S3 access, DynamoDB access, etc.

  tags = merge(local.common_tags, {
    Name = "${local.resource_name_prefix}-ecs-task-role"
  })
}

# ECS Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "${local.resource_name_prefix}-task"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn           = aws_iam_role.ecs_task_role.arn
  network_mode            = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                     = var.task_cpu
  memory                  = var.task_memory

  container_definitions = jsonencode([
    {
      name  = var.container_name
      image = "${data.aws_ecr_repository.app_repository.repository_url}:${var.image_tag}"
      
      essential = true
      
      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
          protocol      = "tcp"
        }
      ]

      environment = var.container_environment_variables

      secrets = var.container_secrets

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.app_logs.name
          "awslogs-region"        = data.aws_region.current.name
          "awslogs-stream-prefix" = "ecs"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", var.health_check_command]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])

  tags = merge(local.common_tags, {
    Name = "${local.resource_name_prefix}-task-definition"
  })
}

# ECS Service
resource "aws_ecs_service" "app" {
  name            = "${local.resource_name_prefix}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.desired_count

  platform_version = "LATEST"

  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight           = 100
  }

  network_configuration {
    security_groups  = [aws_security_group.ecs_sg.id]
    subnets         = data.aws_subnets.default.ids
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = var.container_name
    container_port   = var.container_port
  }

  # Enable execute command for debugging (optional)
  enable_execute_command = var.enable_execute_command

  depends_on = [
    aws_lb_listener.http,
    aws_iam_role.ecs_task_execution_role,
  ]

  tags = merge(local.common_tags, {
    Name = "${local.resource_name_prefix}-service"
  })
}

# Auto Scaling for ECS Service
resource "aws_appautoscaling_target" "ecs_target" {
  count              = var.enable_autoscaling ? 1 : 0
  max_capacity       = var.max_capacity
  min_capacity       = var.min_capacity
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.app.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "scale_up" {
  count              = var.enable_autoscaling ? 1 : 0
  name               = "${local.resource_name_prefix}-scale-up"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target[0].resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target[0].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = var.cpu_target_value
    scale_in_cooldown  = 300
    scale_out_cooldown = 300
  }
}
