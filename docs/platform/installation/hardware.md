---
sidebar_position: 3
title: System Requirements
description: Conduktor Console is provided as a single Docker container.
---

# System Requirements

Conduktor Console is provided as a single Docker container.

Jump to:
 - [Production Requirements](#production-requirements)
 - [Hardware Requirements](#hardware-requirements)


## Production Requirements

For production environments, there are **mandatory requirements** to ensure your deployment is **reliable**, **durable**, and **can be recovered easily**. 

To ensure you meet these requirements, you must:

 - Setup an [external PostgreSQL (13+) database](../configuration/database.md) with appropriate backup policy. 
    - This is used to store data relating to your Conduktor deployment; such as your users, permissions, tags and configurations. 
    - Note that the embedded database is not fit for Production, and we cannot guarantee that your data will be migrated easily. 
 - Setup [block storage](../configuration/env-variables.md#monitoring-properties) (S3, GCS, Azure, Swift) to store metrics data required for Monitoring. 
 - Meet the [hardware requirements](#hardware-requirements) so that Conduktor has sufficient resources to run without issue. 
 
Note that if you are deploying the [Helm chart](./get-started/kubernetes.md), the [production requirements](./get-started/kubernetes.md#production-requirements) are clearly outlined in the installation guide. 

## Hardware Requirements

To configure Conduktor Console for particular hardware, you can use container CGroups limits. More details [here](../configuration/memory-configuration.md)

**Minimum**

- 2 CPU cores
- 3 GB of RAM
- 5 GB of disk space

**Recommended**

- 4+ CPU cores
- 4+ GB of RAM
- 10+ GB of disk space

**Example: Starting the platform in small run mode**

```bash
 docker run --rm \
  -p "8080:8080" \
  -e CDK_DATABASE_URL="postgresql://user:password@host:5432/database" \
  -e LICENSE_KEY="<your-license>" \
  conduktor/conduktor-platform:latest
```

See more about [environment variables](/platform/configuration/env-variables/), or starting the Platform in [Docker Quick Start](/platform/installation/get-started/docker/).