---
date: 2024-10-18
title: Gateway 3.4.0
description: docker pull conduktor/conduktor-gateway:3.4.0
solutions: gateway
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

## Upcoming Breaking change 💣
:::info
This breaking change only impacts Local Gateway service accounts generated through our token endpoints:
- `POST /admin/username/{username}`
- `POST /admin/vclusters/v1/vcluster/{vcluster}/username/{username}`

If you are not using Local Gateway services accounts (OIDC, mTLS, Delegated Kafka), you are **not** impacted.
:::
Today, the token as the password for local Gateway service accounts contains all the necessary information. As a result, the SASL username is not used during the authentication phase.  

In an **upcoming** release, we will strictly enforce that the username and the token matches. This will help reduce inconsistencies and avoid unexpected behaviors.

**This breaking change is due for release 3.5.0.**   
For this release 3.4.0, we'll only raise the following warning in the logs:  
````
2024-08-27T18:15:29 [WARN] - Inconsistency detected for plain authentication. Username applicationA is not consistent with validated token created for application-A. SASL configuration should be changed accordingly.
````

## Features ✨

- [Correct Offsets on Concentrated Topics](#correct-offsets-on-concentrated-topics)

### Correct Offsets on Concentrated Topics

The main limitation of Concentrated Topics was its inability to show correct Lag and Message Count.  

This is now a problem from the past as we are now computing offsets directly within the Gateway.

This experimental feature can be enabled per ConcentrationRule.
````yaml
---
kind: ConcentrationRule
metadata:
  name: myapp-concentrated
spec:
  pattern: myapp-.*
  physicalTopics:
    delete: myapp-concentrated
  autoManaged: false
  trueOffsets: true
````

Check the dedicated documentation for more details on the feature and its limitations.


## General fixes 🔨

- 

## Known issues
- We are aware of an issue with `kcat` when the new environment variable `GATEWAY_MIN_BROKERID` is not aligned with the first BrokerId of your Kafka cluster.
  - As a workaround, you can either define `GATEWAY_MIN_BROKERID` to your first Kafka BrokerId or use `kcat` with the `-E` flag
