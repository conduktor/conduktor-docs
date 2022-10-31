---
sidebar_position: 1
---

# System Requirements

Conduktor Platform is provided as a single Docker container.

Jump to:
 - [Hardware Requirements](#hardware-requirements)
 - [Disabling a Module](#disabling-a-module)

## Hardware Requirements

To configure Conduktor Platform for a particular hardware, you can use the environment variable `RUN_MODE`

| ENV     | Available RAM    |      
|---------|--------------------|
| `nano`    | `8GB`  |
| `small`   | `16GB` |
| `medium`  | `32GB` |
| `large`   | `64GB` |

**Minimum**

 - 4 CPU cores
 - 8 GB of RAM (`RUN_MODE`=nano)
 - 5 GB of disk space

**Recommended**

- 4+ CPU cores
- 16+ Go of RAM (`RUN_MODE`=small)
- 10+ Go of disk space

**Example: Starting the platform in small run mode**
```
 docker run --rm \
  -p "8080:8080" \
  -e LICENSE_KEY="<your-license>" \
  -e RUN_MODE="small" \
  -e KAFKA_BOOTSTRAP_SERVER=0.0.0.0:9092 \
  conduktor/conduktor-platform:1.2.0
```

See more about [environment variables](../configuration/env-variables)

# Disabling a Module

All module can be disabled by environment variable.

Default values:
```sh
 CONSOLE_ENABLED="true"
 TESTING_ENABLED="true"
 MONITORING_ENABLED="true"
 DATA_MASKING_ENABLED="true"
 SCANNER_ENABLED="true"
 GOVERNANCE_ENABLED="true"
```

Example: Disable topic scanner
```sh
 docker run --rm \
  -p "8080:8080" \
  -e LICENSE_KEY="<your-license>" \
  -e RUN_MODE="small" \
  -e SCANNER_ENABLED="false" \
  -e KAFKA_BOOTSTRAP_SERVER=0.0.0.0:9092 \
  conduktor/conduktor-platform:1.2.0
```



