---
sidebar_position: 4
title: Resources Reference
description: All Conduktor resources
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Admonition from '@theme/Admonition';

export const Highlight = ({children, color, text}) => (
<span style={{ backgroundColor: color, borderRadius: '4px', color: text, padding: '0.2rem 0.5rem', fontWeight: '500', }}>
    {children}
</span>
);

export const CLI = () => (
<Highlight color="#F8F1EE" text="#7D5E54">CLI</Highlight>
);

export const API = () => (
<Highlight color="#E7F9F5" text="#067A6F">API</Highlight>
);

export const TF = () => (
<Highlight color="#FCEFFC" text="#9C2BAD">Terraform</Highlight>
);

export const GUI = () => (
<Highlight color="#F6F4FF" text="#422D84">Console UI</Highlight>
);


export const AppToken = () => (
<Highlight color="#F0F4FF" text="#3451B2">Application API Key</Highlight>
);

export const AdminToken = () => (
<Highlight color="#FEEFF6" text="#CB1D63">Admin API Key</Highlight>
);

## Overview

The Resources Reference page lists all the concepts that can be manipulated in Console, as well as how to manage them using an Infra as Code (IaC) approach.   

There are two kinds of API Keys to use with the CLI, Terraform and Public API:
- <AdminToken /> have all permissions over all resources in Console
- <AppToken /> permission are scoped to Application instances & Ownership model defined in Self-service

In general, <AdminToken /> can bypass Application owners and "act" as an <AppToken />  

The resources presented here can be managed from the CLI, the Public API, Terraform, or the Console UI.  
- CLI, Terraform and Public API uses an API Key to validate permissions.
- Console UI relies on RBAC model to validate what the user can do.

## Resources

The resources are split into 3 categories:
- [Console Resources](/platform/reference/resource-reference/console) are resources that exist only in Console such as
  - Cluster Configurations
  - Users, Groups & Permissions
  - Alerts, DataMasking Policies
- [Kafka Resources](/platform/reference/resource-reference/kafka) are Kafka resources that gets created in the Kafka ecosystem
  - Topics
  - Subjects
  - Connectors
  - ...
- [Self-Service](/platform/reference/resource-reference/self-service) Resources
  - Application Groups
  - Topic Policies
  - Instance Service Accounts & ACLs


## Limitations

We're working hard to bring everything that you can do using the Console UI into the CLI, Public API, and Terraform.

Check the availability matrix on each resource using the following labels: 
- <CLI /> <API /> <TF /> <GUI />  

### Conduktor labels
Conduktor labels are a way to add metadata to your resources. Labels are key-value pairs that can be used to filter and organize your resources.  
Support for labels on all Conduktor resources is a subject we're actively working on.

| Resource                         | Label Support |
|----------------------------------|---------------|
| **Console Resources**            |               |
| ConsoleGroup                     | 🚫            |
| ConsoleUser                      | 🚫            |
| KafkaCluster                     | ⚠️ (CLI only) |
| KafkaConnectCluster              | ⚠️ (CLI only) |
| KsqlDBCluster                    | 🚫            |
| Alert                            | ✅             |
| PartnerZone                      | ⚠️ (CLI only) |
| **Kafka Resources**              |               |
| Topic                            | ✅             |
| Subject                          | ⚠️ (CLI only) |
| Connector                        | ⚠️ (CLI only) |
| ServiceAccount                   | ✅             |
| **Self-Service Resources**       |               |
| Application                      | 🚫            |
| ApplicationInstance              | 🚫            |
| ApplicationInstancePermission    | 🚫            |
| ApplicationGroup                 | 🚫            |
| TopicPolicy                      | 🚫            |
