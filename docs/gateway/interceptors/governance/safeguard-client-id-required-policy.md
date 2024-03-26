---
version: 3.0.0
title: Client ID Required Policy
description: Block request or fill the client-id with a templating mechanism if it does not match the specified name convention
parent: governance
license: enterprise
---

## Introduction

If client id does not match the specified name convention, it will respond `PolicyViolationException` when `action`
is `BLOCK`.
Otherwise, fill the client-id with a templating mechanism

We support templating such as `clientId-{{userIp}}-testing"`

Here are the values we can expand:

- `uuid`
- `userIp`
- `vcluster`
- `user`
- `clientId`
- `gatewayIp`
- `gatewayHost`
- `gatewayVersion`
- `apiKey`
- `apiKeyVersion`
- `timestampMillis`

## Configuration

| key              | type              | default | description                                            |
|:-----------------|:------------------|:--------|:-------------------------------------------------------|
| clientIdTemplate | String            |         | Client-id with a templating mechanism to override      |
| namingConvention | String            | `.*`    | Configuration for validating client id name convention |
| action           | [Action](#action) |         | Action to take if the client id is invalid             |

### Action

- `BLOCK` → when fail, save in audit and return error.
- `INFO` → execute API with wrong client id, save in audit.
- `OVERRIDE` → execute API with override value with a templating mechanism, save in audit the fact that we updated on the fly.

## Example

```json
{
  "name": "client-id-required-policy",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
  "priority": 100,
  "config": {
    "namingConvention": "clientId-.*",
    "action": "BLOCK"
  }
}
```

```json
{
  "name": "client-id-required-policy",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
  "priority": 100,
  "config": {
    "namingConvention": "clientId-.*",
    "action": "INFO"
  }
}
```


```json
{
  "name": "client-id-required-policy",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
  "priority": 100,
  "config": {
    "clientIdTemplate": "clientId-{{userIp}}-testing",
    "namingConvention": "clientId-.*",
    "action": "OVERRIDE"
  }
}
```
