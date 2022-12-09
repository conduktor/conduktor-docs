---
sidebar_position: 1
title: Overview
description: Learn how to apply masking policies
---

# Data Masking

:::info
Data Masking is an Enterprise feature. Please [contact us](https://www.conduktor.io/contact) to discuss getting access.
:::

## Overview

The Conduktor Platform enables you to meet compliance regulations and obfuscate personal and sensitive data. As a Platform administrator, you must create policies to secure and govern such data within Conduktor.
 
Policies will be actioned and applied when:
* Consuming Kafka messages in the Console
* Consuming Kafka messages in Conduktor Testing

![data-masking.png](/img/data-masking/data-masking.png)

## Important

Note that data masking **does not impact how the underlying data is stored**. Currently, policies are applied globally at an organization level. Soon, support will be added for fine-grained policies that can be applied for specific groups of users.


## Create a Policy 
Navigate to Data Masking via the home screen or the primary navigation switcher.

Select **Add Policy** and fill out the form with the policy details.

* **Policy Name**: Unique name for identifying your policy
* **Compliance**: The compliance regulation the policy adheres to (GDPR, PCI-DSS) 
* **Information Kind**: The kind of information for obfuscation (e.g. PII, Financial) 
* **Masking Rule**: How the obfuscation should be implemented (e.g. hide-all, hide-last-3)
* **Risk Level**: Categorization for the risk level associated with the policy
* **Fields**: List of fields that should be obfuscated with the masking rule

![data-masking-2.png](/img/data-masking/data-masking-2.png)

## Topic, User and Group Scoped Policies
It's possible to add a more granular scope to Data Masking policies. You can restrict policies to:
 - Topics
 - Users
 - Groups

To implement this, utilize the **Resources** and **Exclude Users or Groups** options within the create policy form. Note that it's possible to use a wilcard to apply constraints to a set of resources with a common prefix. 

![data-masking-4.png](/img/data-masking/data-masking-4.png)

## Validate a Policy
Once you have created a policy, you should validate it through the Conduktor Console. 

* Navigate to a topic that contains data where your policy should be applied
    * _Alternatively, use the 'Produce' tab to mock a message that matches your policy rules_
* Check that the expected fields are obfuscated using the appropriate masking rule

![data-masking-3.png](/img/data-masking/data-masking-3.png)


