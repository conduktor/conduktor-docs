---
date: 2023-09-11
title: User Friendly Filters & Monitoring Storage Externalization
description: Conduktor version 1.18
solutions: console
tags: features,fix
---

This release contains several **breaking changes** so please read the entire release note prior to installation.

## Important changes to our internal architecture ❗

We are cleaning up our Docker image to bring you a simpler, lighter, and generally more operable product.

- We have extracted the 'Storage & Alerting' aspect of the Monitoring Solution from the base Console image and moved it to a dependency image
  - If you didn't use Monitoring, no further action is required from your part
  - **If you used Monitoring**, read the [documentation](https://docs.conduktor.io/platform/get-started/support/important-notices/) to understand how to deploy and configure the dependency image `conduktor/conduktor-platform-cortex:1.18.0`
- We have removed the embedded Postgres Database from the Docker image
- We have removed Testing from the base image
- We have rewritten our authentication module. If you have any issue with authentication using LDAP or OIDC with this new release [Contact Conduktor Support](https://support.conduktor.io/hc/en-gb)

## Features ✨

### User Friendly Filters

We have completely revamped our filtering UX in the Consume page to be more aligned with your day-to-day use cases. Now you can search your topics by combining any of the following filtering mechanisms.

#### Simple Filters

Search for any text in your messages either in your Key, or Value, using basic operators like "equals" or "contains". ![Simple Filters](/images/changelog/platform/v18/filters-1.png)

#### Field Filters

If your message is JSON, Avro or Protobuf, find values from specific fields. Operators can match the selected field type. ![Field Filters](/images/changelog/platform/v18/filters-2.png)

#### Advanced Filters

For when you require more complex rules, Advanced Filters will give you the full power of JS to construct your own custom filters. ![Advanced Filters](/images/changelog/platform/v18/filters-3.png)

### New Design for Service Accounts & Kafka ACLs

We've overhauled Kafka ACLs and service account management. Visualize, create and edit your Kafka ACLs right within the UI with a simple but powerful design. Pair this with our market leading RBAC capability to empower only those that need it ![Service Accounts ACLS 1](/images/changelog/platform/v18/acls-1.png).  
![Service Accounts ACLS 2](/images/changelog/platform/v18/acls-2.png)

## Reduced Memory Footprint

As a result of our improvements to our internal architecture, we are happy to share that we have lowered our hardware requirements.  
If you are currently deployed in prod using `RUN_MODE=nano` or `RUN_MODE=small`, please update the `RUN_MODE` based on your available memory after looking at our documentation.  
If you are using higher `RUN_MODE`, you can free up some memory and save on infrastructure costs.  
Visit our [System Requirements](https://docs.conduktor.io/platform/get-started/installation/hardware/#hardware-requirements) page to see the changes.

## Fixes 🔨

- Fixed a UI issue where Add Partitions wasn't possible when using Firefox
- Fixed some UI issues with Kafka Connect and RBAC
- Added the "Last Indexed Date" info in the Consumer Groups List, to inform the user about the snapshot age
- Fixed an issue where Consumer Groups Details was populated from the snapshot, instead of AdminClient calls
- Fixed an issue where the Delete Consumer Group modal remained opened after deleting the Group
- Fixed an issue where users with Empty Topic permission were also allowed to Create Topics on the same scope
- Fixed an issue where users were logged out of Console when trying to access Datamasking without permission
