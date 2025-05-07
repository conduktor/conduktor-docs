---
date: 2025-04-18
title: Gateway 3.9.0
description: docker pull conduktor/conduktor-gateway:3.9.0
solutions: gateway
tags: fixes
---

- [Breaking changes](#breaking-changes)

- [Features](#features-)

### Breaking changes

#### GATEWAY_USER_POOL_SERVICE_ACCOUNT_REQUIRED environment variable is deprecated

Previously, it was configurable whether the presence of a user mapping to a local service account was required, when a user connected in Non-Delegated SASL/PLAIN mode.
Furthermore, the default value was `false`, meaning unless specifically stated otherwise, the user mapping was not required.

If your Gateway was not configured with `GATEWAY_USER_POOL_SERVICE_ACCOUNT_REQUIRED` set to `true`, and a local service account is not present, the result is a breaking change.

To amend this, you must create a local service account. We can achieve this like below:

```
curl -X PUT -u admin:conduktor http://localhost:8888/gateway/v2/service-account \
        -H 'accept: application/json' \
        -d '{"kind": "GatewayServiceAccount", "apiVersion": "gateway/v2", "metadata": { "name": "admin", "vCluster": "passthrough"  }, "spec": { "type": "LOCAL" }}' 
```

#### GATEWAY_USER_POOL_SECRET_KEY environment variable now mandatory

A breaking change of this feature, documented [here](GATEWAY_USER_POOL_SECRET_KEY environment variable now mandatory-2) is ... #TODO

### Features 

#### GATEWAY_USER_POOL_SECRET_KEY environment variable now mandatory

A default value for `GATEWAY_USER_POOL_SECRET_KEY` is no longer provided. It now must be set on Gateway creation.
When this value is notset, the Gateway will not start. You will be prompted with error message:
```
"Should not be null. Have you checked environment variable GATEWAY_USER_POOL_SECRET_KEY is set?"
```