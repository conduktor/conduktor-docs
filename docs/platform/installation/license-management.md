---
sidebar_position: 6
title: License Management
description: This page provides guidence for how to install, verify and renew licenses for Conduktor Platform.
---

## License installation

Conduktor platform requires a license to enable features beyond the base features.  The license is put into the `platform-config.yaml` file.

On a far left justified line provide a `license` configuration declaration.  Example:
```yaml
clusters:
  - id: default
    name: My Local Kafka Cluster
    color: "#0013E7"
    ignoreUntrustedCertificate: false
    bootstrapServers: "localhost:9092"
    properties:
    schemaRegistry:
      url: "localhost:8081"
      ignoreUntrustedCertificate: false
      properties:
    labels: {}

license: "YOUR_LICENSE_HERE"
```

## License verification

From within the Conduktor Platform container run the following:
```sh
curl -s  http://localhost:3000/platform/api/license | jq .
```

Example:
```
curl -s  http://localhost:3000/platform/api/license | jq .
{
  "raw-token": "<token>",
  "expire": 1669248000,
  "plan": "enterprise",
  "version": 1,
  "features": {
    "admin.auditlog.enable": true,
    "admin.enable": true,
    "console.enable": true,
    "datamasking.enable": true,
    "monitoring.alerting.enable": true,
    "monitoring.enable": true,
    "platform.clusters.limit": -1,
    "platform.rbac.enable": true,
    "platform.sso.enable": true,
    "testing.enable": true,
    "testing.tests.run.monthly.limit": -1,
    "topic.analyser.enable": true,
    "governance.enable": true
  }
}
```

## Renew or install new license

To renew or install a new license, change the `license` configuration in the `platform-config.yaml` file. Then restart the Conduktor Platform container.  
