---
sidebar_position: 400
title: Conduktor resource reference
description: Reference documentation for all Conduktor resources
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';
import Label from '@site/src/components/Labels';

## Overview

<!-- | Console component | Reference |
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
| Interceptors  | [Gateway Interceptor reference](./resource-reference/)  |
 -->

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
          <td>API</td>
          <td>[Console API reference](https://developers.conduktor.io/?product=console)</td>
        </tr>
        <tr>
          <td>Console config</td>
          <td>[Console config reference](/guide/conduktor-in-production/deploy-artifacts/deploy-console/env-variables)</td>
        </tr>
        <tr>
          <td>CLI</td>
          <td>[Console CLI reference](/guide/conduktor-in-production/automate/cli-automation/#configure-console-cli)</td>
        </tr>
        <tr>
          <td>Terraform</td>
          <td>[Terraform reference](/guide/conduktor-in-production/automate/terraform-automation)</td>
        </tr>
        <tr>
          <td>Resources</td>
          <td>[Console resource reference](/guide/reference/console-reference)</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div style={{ flex: 1, minWidth: '250px' }}>
    <table>
      <thead>
        <tr>
          <th>Gateway component</th>
          <th>Link to section</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>API</td>
          <td>[Gateway API reference](https://developers.conduktor.io/?product=gateway)</td>
        </tr>
        <tr>
          <td>Gateway config</td>
          <td>[Gateway config reference](/guide/conduktor-in-production/deploy-artifacts/deploy-gateway/env-variables)</td>
        </tr>
        <tr>
          <td>CLI</td>
          <td>[Gateway CLI reference](/guide/conduktor-in-production/automate/cli-automation/#configure-gateway-cli)</td>
        </tr>
        <tr>
          <td>Interceptors</td>
          <td>[Gateway Interceptor reference](/guide/reference/interceptor-reference)</td>
        </tr>
        <tr>
          <td>Resources</td>
          <td>[Gateway resource reference](/guide/reference/gateway-reference)</td>
        </tr>
      </tbody>
    </table>
  </div>

</div>

The resources reference page lists all the concepts that can be manipulated in Console, as well as how to manage them using an Infra as Code (IaC) approach.

There are two kinds of API keys that you can use with the Conduktor <GlossaryTerm>CLI</GlossaryTerm>, the API and Terraform:

- <Label type="AdminToken" /> - have all the permissions over all the resources in Console. In general, *AdminToken* can bypass application owners.
- <Label type="AppToken" /> - permissions are limited to application instances and ownership is defined via Self-service

## Resource categories

Our resources can be managed via the CLI, the API, Terraform (using the API keys), or Console UI (which relies on <GlossaryTerm>RBAC</GlossaryTerm>).

There are three categories:

- [Console resources](/guide/reference/console-reference) exist only in Console. For example, users, groups, permissions, cluster configurations, alerts. data masking policies.
- [Kafka resources](/guide/reference/kafka-reference) get created in the Kafka ecosystem, e.g.: topics, subjects, connectors.
- [Self-service resources](/guide/reference/self-service-reference) such as application groups and topic policies.

## Conduktor labels

Conduktor Console labels allow you to add metadata, filter, categorize and organize your resources. Check the following table for the list of currently supported resources.

- <Label type="FullLabelSupport" />
- <Label type="PartialLabelSupport" />
- <Label type="MissingLabelSupport" />

## Supported resources

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
