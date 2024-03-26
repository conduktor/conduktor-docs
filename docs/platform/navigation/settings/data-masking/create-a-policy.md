---
sidebar_position: 2
title: Create a Policy
description: How to create a Data Masking policy
---

In order to create a Data Masking policy and protect your data, you should navigate to the **Data Policies** section of the **Settings**. If you don't see this tab, you may not have the appropriate permissions to create policies.

![List of policies](/img/data-masking/overview-policies.png)

Here, you can click on **Add Policy** and fill out the form with the policy details.

The minimum set of properties you'll have to set is the following:

| Policy Detail    | Description                                                            |
| ---------------- | ---------------------------------------------------------------------- |
| Policy Name      | Unique name for identifying your policy                                |
| Compliance       | The compliance regulation the policy adheres to (e.g. GDPR, PCI-DSS)   |
| Information Kind | The kind of information for obfuscation (e.g. PII, Financial)          |
| Masking Rule     | How the obfuscation should be implemented (e.g. hide-all, hide-last-3) |
| Risk Level       | Categorization for the risk level associated with the policy           |
| Fields      | List of fields that should be obfuscated. It's based on JSON, and can be a path. If you want to hide multiple fields, you can click on **Add field**.                              |

![Add a policy](/img/data-masking/add-policy.png)

## Restrict to Resources, Users and Groups

Then, you can define how you want this policy to be applied, by defining the properties below:

| Policy Detail    | Description                                                            |
| ---------------- | ---------------------------------------------------------------------- |
| Resources      | List of resources where the policy must be applied, like clusters or topics. To add new resources, you can click on **Add resource**.  |
| Exclude Users or Groups from policy | In case you want some users or groups to see the data, you can exclude them from the policy. |

![Add a policy](/img/data-masking/add-policy-extra.png)

In the case above, the policy will mask the field `name`, for all the users **except people from the group "Project A"**, on the topic `accounts` of the `Local Kafka` cluster.

After having created the policy, you can see it in the list of policies:

![List of policies after the creation.png](/img/data-masking/policies-list-after.png)

## Validate a Policy
Once you have created a policy, you should validate it through the Conduktor Console. 

* Navigate to a topic that contains data where your policy should be applied
* Check that the expected fields are obfuscated using the appropriate masking rule

![data-masking-3.png](/img/data-masking/result-after.png)

We can see that the name is completely hidden, as we defined in the masking rule.
