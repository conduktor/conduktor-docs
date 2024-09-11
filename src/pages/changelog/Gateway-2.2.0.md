---
date: 2023-10-27
title: Usage metrics per vcluster, selective field decryption, reliability & performance enhancements
description: ''
solutions: gateway
tags: features,fix
---

## Features ✨

### Usage metrics per topic and vcluster

The `gateway.bytes_exchanged.topic` metric now shows the total bytes exchanged, for a specific topic. This can be measured on fetch or produce.

`gateway_bytes_exchanged_topic_total{vcluster="vcluster-test", topic="topic-test", apiKeys="Fetch"}`

### Field level decryption

Decryption can now be performed on a field level basis enabling encryption of several fields and then selective decryption of fields depending on the user (application).

Fields can be defined in the decryption interceptor configuration;

```json
      "fields": [
         "visa",
         "sales.account.username"
      ]
```


#### OAuth principal to vcluster mapping

When you don't have the luxury to specify claims, we now provide the ability to map Oauth principals to vclusters, for usernames, through the Gateway API.

For example; here you are mapping the username, `conduktor` to the vcluster, `my-vcluster`.

```
curl --location ‘host:port/admin/userMappings/v1/vcluster/my-vcluster’ \
--header ‘Content-Type: application/json’ \
--user “admin:conduktor” \
--data ‘{
    “username”: “conduktor”
}’
```

This is documented within the API docs also.

## General fixes 🔨

- Patched ACLs visibility to be isolated across vclusters
- Consistent use of trailing slashes in the API calls, will now work including the `/` or ignoring it is supported
- Set Gateway's GID in the distro baseimage to 1000, to aid in container management and interactions
- Fixed an issue with create topic policy enforcement compatability on different compression types
- When running clusters with several thousand topics Gateway application performance has been improved
- Better SSL support during cluster switching
