---
sidebar_position: 6
title: Migration Guide to API V2
description: Need to know changes between V1 and V2 APIs
---

Gateway `3.3.0` introduces API V2 to bring an enhanced user experience when interacting with Gateway resources. 

If you are migrating from API V1 to V2, your Gateway resources will be preserved (meaning, you can interact with old resources via the V2 API), and only minimal attention is required for the below resources:

## Virtual Clusters

- The automation will derive the boolean value `aclEnabled` from the previously used `GATEWAY_ACL_STORE_ENABLED` variable.
- The migration will not populate the `superUsers` list automatically, so this must be addressed as part of your migration.

Example configuration:

```yaml
---
apiVersion: gateway/v2
kind: VirtualCluster
metadata:
  name: "mon-app-A"
spec:
  aclEnabled: true # defaults to false
  superUsers:
  - username1
  - username2
```

## Gateway Service Account

User Mappings become GatewayServiceAccount.
Every existing User Mapping is migrated to V2 as EXTERNAL GatewayServiceAccount.  

If you were using Local Users (and generating tokens) with API V1, new actions are required on your part.

**Required action**: You will need to first declare LOCAL users in V2 APIs to then be able to generate tokens

