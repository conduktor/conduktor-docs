---
sidebar_position: 4
title: Partner Zones
description: Securely share your Kafka streaming data with external partners.
---

## Overview
Partner Zones allow you to share streaming data with external partners selectively and securely, without the need to replicate data or create duplicate Kafka clusters. You can:
- set up **dedicated zones** with **customized access** to data
- create a **single source of truth** because data isn't duplicated
- **reduce operational costs**, since you don't have to keep data streams synchronized
- control access to Kafka topics with **tailored permissions**

![Partner Zones overview](assets/pz-detail-view.png)

:::info
Partner Zones is currently in **Beta** and this functionality is only available for **Console 1.31.0** and **Gateway 3.5.0** (or later).
:::

## Create credentials
Before creating a Partner Zone, you have to first connect Conduktor Console to Conduktor Gateway and create credentials to secure the data you're about to share.

1. Access Gateway as the `admin` user and create a secret token:

```bash
curl --request POST "http://localhost:8888/admin/vclusters/v1/vcluster/passthrough/username/admin" \
    --user "admin:conduktor" \
    --header 'accept: application/json' \
    --header 'Content-Type: application/json' \
    --data-raw '{"lifeTimeSeconds": 7776000}' | jq -r ".token"
```

2. In Console, go to **Settings** > **Clusters** and select the relevant cluster.
3. For **Authentication method** select **SASL** and use the token.


## Create a Partner Zone
You can create a Partner Zone from **Console's UI**, or the **Conduktor CLI**.

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="First Tab" label="Console UI">
Use the Console UI to create a Partner Zone in just a few steps.

:::alert
 Currently, only `admin` users have access to Partner Zones.
:::

1. In Conduktor Console, go to **Settings** > **Partner Zones** and click **+New zone**. 
1. Start with the details:
   - Add a descriptive **name** for the zone.
   - The **Technical ID** will be auto-populated as you type in the name. This is used to identify this zone in CLI/API.
   - **Service account** will also be auto-generated based on the name but you can edit this as required. [Service accounts](/platform/navigation/console/service-accounts/) are used to define permissions to Kafka resources, called ACLs (Access Control Lists).
   - (Optional) Enter the **URL** of your partner.
   - Enter a **Description** to explain your reasons/requirements for sharing data.
   - (Optional) Specify contact details of the beneficiary/recipient of this Partner Zone. 
   - **Select Gateway** you want to use and click **Continue**.
1. Choose which data to share: **select the Kafka topics** to include in this zone. By default, any topics that are shared, will be shared with **Read** access for security. You can additionally allow access to **Write**. Click **Continue** when done.
1. Finally, **Enable global transformations** or skip to continue with the defaults. Currently, we only offer **Traffic control policies**, set to the following:
   - `Maximum Produce Rate`: 10 000 bytes/sec.
   - `Maximum Consume Rate`: 10 000 bytes/sec.
   - `Limit Commit Offset`: 30 attempts/min.
1. Review the details and if you're happy with the data you're about to share, click **Create**.

It will *take a few moments* for the zone to be created. 

Once completed, the **Credentials** will be displayed. Copy/download and share these as required.

:::warning
If these credentials are lost, you may have to re-create the Partner Zone.
:::

To view and manage all the zones you have access to, go to **Settings** > **Partner Zones**. You'll see the total number of zones and topics shared, as well as a list of zones, each showing:
- name and URL
- the number of topics shared
-  Gateway details
- the status:
  - **Pending**: means the configuration isn't deployed or refreshed yet
  - **Ready**: shows that the configuration is up-to-date on Gateway
  - **Failed**: indicates that something unexpected happened during the creation. Check that the connected Gateway is active.
- the date the zone was last updated

Click on a Partner Zone to view its details.

You can **delete Partner Zones** in the zone list view (click the **three dots** on the right-hand side and select **Delete**) or when viewing the details of a zone, click the **trash can** at the top right corner. 

A confirmation window will pop up. Enter `DELETE` to confirm the deletion. *This can't be undone.*

</TabItem>
<TabItem value="Second Tab" label="Conduktor CLI">
Once Gateway is configured, you can use [Conduktor CLI (Command Line Interface)](/gateway/reference/cli-reference/) to create a Partner Zone.

1. Copy below and save it as a YAML file (e.g. `pz.yaml`): 
    ```yaml
    apiVersion: v2
    kind: PartnerZone
    metadata:
      name: external-partner-zone
    spec:
      cluster: partner1
      displayName: External Partner Zone
      url: https://partner1.com
      serviceAccount: johndoe
      topics:
        - name: topic-a
          backingTopic: kafka-topic-a
          permission: WRITE
        - name: topic-b
          backingTopic: kafka-topic-a
          permission: READ
      partner:
        name: John Doe
        role: Data analyst
        email: johndoe@company.io
        phone: 07827 837 177
    ```
1. Use [Conduktor CLI](/gateway/reference/cli-reference/) to apply the configuration:
    ```bash
    conduktor apply -f pz.yaml
    ```
   :::tip
   Replace `pz.yaml` with your file name, if not using the suggestion.
   :::

1. Check the status of the Partner Zone:
    ```bash
    ❯ conduktor get PartnerZone
    ---
    apiVersion: v2
    kind: PartnerZone
    metadata:
        name: john-partner-zone
        id: 332b30cd-7bda-4659-b1c1-39986986f0bd
        updatedAt: "2025-01-27T12:55:05.387368Z"
        status: PENDING
    spec:
        cluster: partner1
        displayName: Johns partner zone
        url: https://partner1.com
        serviceAccount: johndoe
        topics:
            - name: topic-a
              backingTopic: kafka-topic-a
              permission: WRITE
            - name: topic-b
              backingTopic: kafka-topic-a
              permission: READ
        partner:
            name: John Doe
            role: Data analyst
            email: johndoe@company.io
            phone: 07827 837 177
    ```
    The `metadata status`can have one of these values:
      - **Pending**: the configuration isn't deployed or refreshed yet
      - **Ready**: the configuration is up to date on Gateway
      - **Failed**: something unexpected happened during the creation

1. To securely connect to a Partner Zone through Kafka client, we've created a service account `spec.serviceAccount`. For additional security, you have to also generate a password for it:
    ```bash
    cur --request POST \
        --url 'http://localhost:8080/public/partner-zone/v2/$PARTNER_ZONE_NAME/generate-credentials' \
        --header "Authorization: Bearer $CDK_API_KEY"
    ```

1. Once generated, retrieve the password and create a `config.properties` file:
    ```bash
    security.protocol=SASL_PLAINTEXT
    sasl.mechanism=PLAIN
    sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username=johndoe password=${SERVICE_ACCOUNT_PASSWORD};
    ```

1. Finally, use CLI to list the topics of the Partner Zone:
    ```bash
    ❯ kafka-topics --bootstrap-server gateway:9094 --list --command-config config.properties
    topic-a
    topic-b
    ```
</TabItem>
</Tabs>

## Troubleshoot
<details>
  <summary>What does Partner Zone status mean?</summary>
  <p>
  This is the status of a Partner Zone:
    - **Pending**: the configuration isn't deployed or refreshed yet
    - **Ready**: the configuration is up to date on Gateway
    - **Failed**: something unexpected happened during the deployment. Check that the connected Gateway is active.
  </p>
</details>
<details>
  <summary>Does **Generate password** invalidate the previous credentials of service account?</summary>
  <p>No, you can't invalidate the credentials. If unsure, delete the Partner Zone and re-create it.</p>
</details>
<details>
  <summary>My Partner Zone creation failed, how do I find out what the issue is?</summary>
  <p>To check status, [use the API](https://developers.conduktor.io/?product=console&version=1.31.2#tag/cli_partner-zone_console_v2_16) or [Console logs](/platform/navigation/settings/audit-log/).</p>
</details>


## Related resources
 - [Connect to clusters](/platform/navigation/settings/managing-clusters/)
 - [Service accounts](/platform/navigation/console/service-accounts/)
 - [Give us feedback/request a feature](https://conduktor.io/roadmap)