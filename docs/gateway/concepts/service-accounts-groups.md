---
sidebar_position: 4
title: Service Accounts Groups
description: Definition of Service Accounts Groups in the Gateway
---

## Introduction

The Gateway Service Accounts Groups are used to **scope interceptors for a set of service accounts**. 

With these Groups, you can gather all the application Service Accounts defined on the Gateway that should follow a common set of interceptors rules.

:::note
They **can't be used for managing ACLs** of these Service Accounts today.
:::

## Creation

You can create a Group by using the Gateway API.

You can find the object definition and additional details on the [Gateway Group Resource Reference page](/gateway/reference/resources-reference/#gatewaygroup).

## Apply an Interceptor to a Group

After having created the Group, you can apply interceptors to it directly from within the interceptor configuration.

As detailed in the [Interceptor Resource Reference page](/gateway/reference/resources-reference/#interceptor), you can define to which Group the interceptor should apply by setting the `metadata.scope.group`.