---
sidebar_position: 1
title: Data Masking
description: Overview of the Data Masking feature
---

# Overview

In order to meet **compliance regulations**, Conduktor Console provides a Data Masking feature that enables you to **obfuscate personal and sensitive data** within the Console.

As a Console administrator, you can **secure and govern** such data by creating Data Masking policies, so that users can't see them.

:::info
Data Masking **does not impact how the underlying data is stored**. The data will only be masked **within the Console**. For masking, or encrypting, the underlying Kafka data, you can use the [Conduktor Gateway](/gateway/).

:::

Policies will be applied when **consuming Kafka messages in the Console**, as shown below. We can see that the phone number, the IBAN, and the card number, have been masked with some *****.

![Example of masked data](/img/data-masking/result-before.png)

Here is the list of policies applied in this case.

![List of policies](/img/data-masking/overview-policies.png)

You can go to the [Create a Policy](./create-a-policy) section in order to know more, and create your own policies.