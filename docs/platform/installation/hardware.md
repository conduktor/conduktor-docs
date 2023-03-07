---
sidebar_position: 2
title: System Requirements
description: Conduktor Platform is provided as a single Docker container.
---

# System Requirements

Conduktor Platform is provided as a single Docker container.

Jump to:

- [Hardware Requirements](#hardware-requirements)
- [Disabling a Module](#disabling-a-module)

## Hardware Requirements

To configure Conduktor Platform for a particular hardware, you can use the environment variable `RUN_MODE`

| ENV      | Available RAM |
| -------- | ------------- |
| `nano`   | `8GB`         |
| `small`  | `16GB`        |
| `medium` | `32GB`        |
| `large`  | `64GB`        |

**Minimum**

- 4 CPU cores
- 8 GB of RAM (`RUN_MODE`=nano)
- 5 GB of disk space

**Recommended**

- 4+ CPU cores
- 16+ GB of RAM (`RUN_MODE`=small)
- 10+ GB of disk space

**Example: Starting the platform in small run mode**

```bash
 docker run --rm \
  -p "8080:8080" \
  -e LICENSE_KEY="<your-license>" \
  -e RUN_MODE="small" \
  conduktor/conduktor-platform:latest
```

See more about [environment variables](/platform/configuration/env-variables/), or starting the Platform in [Docker Quick Start](/platform/installation/get-started/docker/).

# Disabling a Module

All module can be disabled by environment variable.

Default values:

```bash
 CONSOLE_ENABLED="true"
 TESTING_ENABLED="true"
 MONITORING_ENABLED="true"
 DATA_MASKING_ENABLED="true"
 SCANNER_ENABLED="true"
 GOVERNANCE_ENABLED="true"
```

Example: Disable topic scanner

```bash
 docker run --rm \
  -p "8080:8080" \
  -e LICENSE_KEY="<your-license>" \
  -e RUN_MODE="small" \
  -e SCANNER_ENABLED="false" \
  conduktor/conduktor-platform:latest
```

See more about starting the Platform in [Docker Quick Start]((/platform/installation/get-started/docker/).
