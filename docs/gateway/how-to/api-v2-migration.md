---
sidebar_position: 5
title: API V2 Migration guide
description: Need to know changes between V1 and V2 APIs
---

## Virtual Clusters

- The automation will derive the boolean value `aclEnabled` from the previously used `GATEWAY_ACL_STORE_ENABLED` variable.
- The migration will not populate the `superUsers` list automatically, so this must be addressed as part of your migration.

## GatewayServiceAccount

User Mappings become GatewayServiceAccount

Every existing User Mapping is migrated to V2 as EXTERNAL GatewayServiceAccount.  
If you have created User Mappings using API V1 for Local Users to belong to Groups, you won't be able to generate a token through the V2 API.

You will need to declare them as LOCAL users in V2 APIs to start generating tokens

