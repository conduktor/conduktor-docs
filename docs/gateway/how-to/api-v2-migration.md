---
sidebar_position: 5
title: API V2 Migration guide
description: Need to know changes between V1 and V2 APIs
---

Most entities are maintained, slightly rebranded for a better UX, between V1 and V2.  
As a result, only minimal attention should be required.

## Virtual Clusters

- The automation will derive the boolean value `aclEnabled` from the previously used `GATEWAY_ACL_STORE_ENABLED` variable.
- The migration will not populate the `superUsers` list automatically, so this must be addressed as part of your migration.

## GatewayServiceAccount

User Mappings become GatewayServiceAccount.
Every existing User Mapping is migrated to V2 as EXTERNAL GatewayServiceAccount.  

**Required action**
If you were using Local Users (and generating tokens) with API V1, new actions are required on your part.
- You will need to first declare LOCAL users in V2 APIs to then be able to generate tokens

