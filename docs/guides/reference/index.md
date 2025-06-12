---
sidebar_position: 400
title: Conduktor resource reference
description: Reference documentation for all Conduktor resources
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';
import Label from '@site/src/components/Labels';

## Overview

| Console component | Reference |
|----------|----------|
| Console   | [Console API reference](https://developers.conduktor.io/?product=console)  |
| Console   | [Console configuration reference](../get-started/configuration/env-variables)  |
| Console   | [Console CLI reference](./cli-reference.md)  |
| Console   | [Terraform reference](./terraform-reference.md)  |
| Console   | [Console resources reference](./resource-reference/)  |

| Gateway Component | Reference |
|----------|----------|
| Gateway   | [Gateway API reference](https://developers.conduktor.io/?product=gateway)  |
| Gateway   | [Gateway configuration reference](../../gateway/configuration/env-variables)  |
| Gateway   | [Gateway CLI reference](../../gateway/reference/cli-reference)  |
| Gateway   | [Gateway resources reference](../../gateway/reference/resources-reference)  |
| Interceptor   | [Gateway Interceptor reference](./resource-reference/)  |



<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>

  <div style={{ flex: 1, minWidth: '250px' }}>
    <table>
      <thead>
        <tr>
          <th>Console component</th>
          <th>Link to section</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Console API</td>
          <td>[Console API reference](https://developers.conduktor.io/?product=console)</td>
        </tr>
        <tr>
          <td>Row 2A</td>
          <td>Row 2B</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div style={{ flex: 1, minWidth: '250px' }}>
    <table>
      <thead>
        <tr>
          <th>Header B1</th>
          <th>Header B2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Row 1C</td>
          <td>Row 1D</td>
        </tr>
        <tr>
          <td>Row 2C</td>
          <td>Row 2D</td>
        </tr>
      </tbody>
    </table>
  </div>

</div>











The resources reference page lists all the concepts that can be manipulated in Console, as well as how to manage them using an Infra as Code (IaC) approach.

There are two kinds of API keys that you can use with the CLI, Terraform and public API:

- <Label type="AdminToken" /> have all permissions over all resources in Console
- <Label type="AppToken" /> permission are scoped to Application instances and ownership model defined in Self-service

In general, <Label type="AdminToken" /> can bypass Application owners and "act" as an <Label type="AppToken" />. 

The resources presented here can be managed from the CLI, the API, Terraform, or the Console UI.

- CLI, Terraform and Public API uses an API Key to validate permissions.
- Console UI relies on RBAC model to validate what the user can do.

## Resources

The resources are split into 3 categories:

- [Console Resources](/guides/reference/console-reference) are resources that exist only in Console such as
  - Cluster Configurations
  - Users, Groups and Permissions
  - Alerts, DataMasking Policies
- [Kafka Resources](/guides/reference/kafka-reference/kafka) are Kafka resources that gets created in the Kafka ecosystem
  - Topics
  - Subjects
  - Connectors
  - ...
- [Self-service resources](/guides/reference/self-service-reference)
  - Application Groups
  - Topic Policies
  - Instance Service Accounts and ACLs

## Limitations

We're working hard to bring everything that you can do using Console UI into the Conduktor CLI, APIs and Terraform.

For a quick visual reference, each resource will list the supported systems with relevant tags:

<Label type="UI" /> <Label type="CLI" /> <Label type="API" /> <Label type="TF" /> 

## Conduktor labels

Conduktor labels allow you to add metadata, filter and organize your resources. Check the following table for the list of currently supported resources.

- <Label type="FullLabelSupport" />
- <Label type="PartialLabelSupport" />
- <Label type="MissingLabelSupport" />

| Resource                     | API/CLI support | Terraform support    | Label support  | 
|------------------------------|-----------------|----------------------|----------------|
| **Console resources**        |                 |                      |                |
| ConsoleGroup                 | ✅               | ✅                    | 🚫             |
| ConsoleUser                  | ✅               | ✅                    | 🚫             |
| KafkaCluster                 | ✅               | ✅                    | ⚠️ (Not in UI) |
| KafkaConnectCluster          | ✅               | ✅                    | ⚠️ (Not in UI) |
| KsqlDBCluster                | ✅               | ⚠️(Generic Resource) | 🚫             |
| Alert                        | ✅               | ⚠️(Generic Resource) | 🚫             |
| DataMaskingPolicy            | 🚫              | 🚫                   | 🚫             |
| Certificate                  | 🚫(V1 API only) | 🚫                   | 🚫             |
| PartnerZone                  | ✅               | ⚠️(Generic Resource) | ⚠️ (Not in UI) |
| **Kafka resources**          |                 |                      |                |
| Topic                        | ✅               | ✅                    | ✅              |
| Subject                      | ✅               | ⚠️(Generic Resource) | ⚠️ (Not in UI) |
| Connector                    | ✅               | ⚠️(Generic Resource) | ⚠️ (Not in UI) |
| ServiceAccount               | ✅               |                      | ✅              |
| **Self-service resources**   |                 |                      |                |
| Application                  | ✅               | ✅                    | 🚫             |
| ApplicationInstance          | ✅               | ✅                    | 🚫             |
| ApplicationInstancePermission | ✅               | ⚠️(Generic Resource) | 🚫             |
| ApplicationGroup             | ✅               | ⚠️(Generic Resource) | 🚫             |
| TopicPolicy                  | ✅               | ✅                    | 🚫             |
