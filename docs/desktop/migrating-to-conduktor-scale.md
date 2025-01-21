---
sidebar_position: 2
title: Migrating to Conduktor Scale
description: We're sunsetting Desktop at the end of 2025 - learn how to migrate to Conduktor Scale
---

# Migrating to Conduktor Scale

We want to extend our thanks to all our users who have helped shape Conduktor Desktop with their trust and feedback. After years of supporting you in utilizing Kafka, Conduktor Desktop is stepping aside at the end of 2025. Why? Because your needs have evolved—and so have we.

You can read the full announcement [here](https://conduktor.io/desktop). 

# Introducing Conduktor Scale

Rest assured, we have you covered with Conduktor Scale - a centralized, web-based platform built for modern data streaming, delivering the security, speed, and performance your team needs to stay ahead.

![Console Home page](../platform/assets/home.png)

With the new Conduktor, you'll enjoy:
 - **Modern Web-Based Interface**
    - Enhances collaboration, maintainability, and user management through a centralized environment.
 - **Real-Time Monitoring and Alerting**
    - Integrations with messaging platforms and custom event triggers.
 - **Streamlined Workflows**
    - APIs, CLI, and Terraform support to improve GitOps workflows and infrastructure management.
 - **Powerful Automation Features**
    - Automatic connector restarts, SQL querying, and self-service tools.
 - **Deeper Integrations**
    - Works seamlessly with managed service providers like AWS and Confluent.
 - **Enhanced Security**
    - Granular Role-Based Access Control (RBAC), audit logging, and data masking for compliance.

## Preparing to Migrate

### Key Changes

Unlike the Desktop version, the new Conduktor platform is deployed centrally on a server (e.g. ECS, EKS) rather than installed on individual machines. This centralization offers:

 - A single deployment to manage patches and upgrades
 - Improved governance with visibility over user activities and data access
 - Enhanced collaboration features such as shareable URLs and shareable consumer filters

![desktop-scale-comparison](./assets/desktop-console-comparison.png)

### High-Level Architecture

Conduktor consists of two core Docker images:

 - **conduktor-console**
    - Provides the UI and core features for managing Kafka resources
 - **conduktor-console-cortex**
    - Supports monitoring, alerting, and integrations with observability platforms

![scale-architecture-overview](./assets/scale-architecture-overview.png)

#### Key Dependencies

 - PostgreSQL Database
    - Stores platform configurations, roles, and user accounts
    - For this, we recommend using a managed service with automated backups, such as Amazon RDS

 - Storage for Metrics
    - Local or object storage (AWS S3, Azure Blob) for historical time-series data

[System Requirements](../../platform/get-started/installation/hardware)

### Deployment Options

Deploying Conduktor in a server environment is simplified using:

 - [Helm charts](../../platform/get-started/installation/get-started/kubernetes)
 - [Docker Compose](../../platform/get-started/installation/get-started/docker)
 - [AWS Marketplace / CloudFormation templates](../../platform/get-started/installation/get-started/aws-marketplace-and-cloudformation)

[Deployment Options](../../platform/category/deployment-options)

### Licensing

If you are migrating to the Community edition of Scale, a license key is not required to start Conduktor. However, please note that Enterprise capabilities will not be available.

On the other hand, if you are migrating to Scale Standard or Scale Plus, you will receive a license key that should be configured as an [environment variable](../platform/get-started/configuration/env-variables/#global-properties).

### Re-Integrating Your Kafka Clusters

![desktop-scale-clusters](./assets/desktop-scale-clusters.png)

Once your deployment is running, configure your Kafka clusters:

 1. Navigate to **Settings > Clusters** to add your cluster details
 2. Configure clusters once with sufficient privileges for all users
 3. Utilize our granular RBAC model for fine-grained access control

For an Infrastructure-as-Code approach, cluster configurations can also be managed via CLI or environment variables:

 - [CLI: Kafka Cluster Reference](../../platform/reference/resource-reference/console/#kafkacluster)
 - [Environment Variable Reference](../../platform/get-started/configuration/env-variables/#kafka-clusters-properties)

### Inviting Your Team

You can invite users in two ways:

 - Local Users: Add them directly within the application
 - Single Sign-On (SSO): Integrate with your identity provider via LDAP or OIDC

For SSO configuration, set the required environment variables and refer to our documentation for popular identity providers:

 - [Local Users](../../platform/get-started/configuration/user-authentication/local-admin-and-users/)
 - [SSO Configuration](../../platform/category/configure-sso)

### Assigning Permissions

![scale-team-permissions](./assets/scale-team-permissions.png)

Leverage the RBAC model to assign permissions:

 1. Navigate to **Settings > Users & Groups**
 2. Assign **Service Access** to restrict application areas
 3. Assign **Resource Access** to control access to specific Kafka resources

Example: Grant viewer-only permissions to a topic or consumer group

### Troubleshooting & Support

If you encounter any issues during migration, our [support](https://support.conduktor.io/) team are available to assist.

Thank you for choosing Conduktor!

