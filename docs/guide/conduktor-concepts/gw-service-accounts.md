---
title: Gateway service accounts
description: Learn Conduktor terminology
---

Application service accounts defined in <GlossaryTerm>Gateway</GlossaryTerm> that follow a common set of <GlossaryTerm>Interceptor</GlossaryTerm> rules can be grouped.

This allows you to [scope Interceptors](/guide/conduktor-concepts/interceptors/#interceptor-scope) for multiple service accounts.

:::info[Limitation]
These groups **can't be used for managing ACLs** of the service accounts.
:::

## Create a service account group

Use the [Gateway API](https://developers.conduktor.io/?product=gateway) to create a `group`.

[Find out more about this resource](/guide/reference/gateway-reference/#gatewaygroup).

## Apply an Interceptor to a group

Once a group is created, you can apply Interceptors to it directly from within the Interceptor configuration.

Use `metadata.scope.group` to define which group the Interceptor should apply to. [Find out more](/guide/reference/gateway-reference/#interceptor-targeting).
