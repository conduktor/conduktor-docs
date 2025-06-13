---
sidebar_position: 340
title: Share data externally
description: Share data securely with external partners using Conduktor
---

Third-party data sharing can be done securely and selectively using Conduktor.

import ProductExchange from '@site/src/components/shared/product-exchange.md';

<ProductExchange />

## Partner Zones

import AlertPreview from '@site/src/components/shared/alert-preview.md';

<AlertPreview />

Partner Zones allow you to share Kafka topics with external partners selectively and securely. You can:

- set up **dedicated zones** with **customized access** to Kafka topics
- create a **single source of truth** because data isn't duplicated
- **reduce operational costs**, since you don't have to keep data streams synchronized

![Partner Zones overview](/guide/pz-detail-view.png)

## Prerequisites

Before creating a Partner Zone, you have to:

- use **Conduktor Console 1.32** or later
- use **Conduktor Gateway 3.6.1** or later with the following configurations:
  - `GATEWAY_SECURITY_PROTOCOL` set to `SASL_PLAIN` or `SASL_SSL` (`DELEGATED_SASL_*` modes are not supported)
  - `GATEWAY_USER_POOL_SERVICE_ACCOUNT_REQUIRED` set to `true`
- use a service account to connect to Gateway, that can access the topics you want to share
- be logged in as an admin to Console UI, or using an admin token for the CLI
- in Console, [configure your Gateway cluster](/guide/conduktor-in-production/admin/configure-clusters) and fill in the **Provider** tab with Gateway API credentials

:::warning Current limitations
As of v1.32, Partner Zones have the following limitations:

- Partners will only be able to connect to your zone using **Local Gateway Service Accounts**.
- Passwords do not expire. If you need **to revoke access** to your partner, you will have to delete the Partner Zone.
:::

## Create a Partner Zone

You can create a Partner Zone from the **Console UI**, or the **Conduktor CLI**.

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="First Tab" label="Console UI">
Use the Console UI to create a Partner Zone in just a few steps.

1. In Conduktor Console, go to **Settings** > **Partner Zones** and click **+New zone**.
1. Define the Partner Zone details:
   - Add a descriptive **name** for the zone.
   - The **Technical ID** will be auto-populated as you type in the name. This is used to identify this zone in CLI/API.
   - **Service account** will also be auto-generated based on the name but you can edit this as required. [Service accounts](/platform/navigation/console/service-accounts/) are used to define permissions to Kafka resources, called ACLs (Access Control Lists).
   - (Optional) Enter a relevant **URL** for your partner.
   - (Optional) Enter a **Description** to explain your reasons/requirements for sharing data.
   - (Optional) Specify contact details of the beneficiary/recipient of this Partner Zone.
   - **Select Gateway** to choose the one you want to use and click **Continue**.
1. Choose what and how to share:
   - **Select the Kafka topics** to include in this Partner Zone, you can filter topics by custom labels you've defined or search for topic name.
   - **Select Read/Write**. By default, any topics that are shared, will be shared with **Read**-only access, but you can additionally allow **Write** access.
   - (Optional) **Rename topics** for how you want the consumer to read them by hovering over the name of any topic being shared, and selecting the **pencil** button.
   - **Continue** when done.
1. (Optional) Protect your cluster by limiting clients with Traffic Control Policies. Limit their rate of producing, consuming or committing offsets.
1. Review the details and if you're happy with the data you're about to share, click **Create**.

It will *take a few moments* for the zone to be created.

Once completed, the **Credentials** will be displayed. Copy/download and share these as required.

To view and manage all the zones you have access to, go to **Settings** > **Partner Zones**. You'll see the total number of zones and topics shared, as well as a list of zones, each showing:

- name and URL
- the number of topics shared
- Gateway details
- the status:
  - **Pending**: means the configuration isn't deployed or refreshed yet
  - **Ready**: shows that the configuration is up-to-date on Gateway
  - **Failed**: indicates that something unexpected happened during the creation. Check that the connected Gateway is active.
- the date the zone was last updated

Click on a Partner Zone to view its details.

</TabItem>
<TabItem value="Second Tab" label="Conduktor CLI">
You can also use the [Conduktor CLI (Command Line Interface)](/gateway/reference/cli-reference/) to create Partner Zones.

1. Save this example to file, e.g. `pz.yaml`:

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

    The `metadata status` can have one of these values:
      - **Pending**: the configuration isn't deployed or refreshed yet
      - **Ready**: the configuration is up to date on Gateway
      - **Failed**: something unexpected happened during the creation

1. To securely connect to a Partner Zone through Kafka client, we've created a service account `spec.serviceAccount`. For additional security, you have to also generate a password for it:

    ```bash
    curl --request POST \
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

## Edit a Partner Zone

<Tabs>
<TabItem value="First Tab" label="Console UI">
To edit a Partner Zone you can either:
- go to the Partner Zone page list view, and click the **three dots** on the right-hand side then select **Edit**
- or go to a specific Partner Zone's details view, click the **Edit** button in the top right corner.

This will open the Partner Zone details window in edit mode, allowing you to:

- update Partner Zone details (name, URL, description and contact details)
- manage topics - add new ones or change topic aliases
- change traffic control policies

### Change zone details

- Name (hover over the name and click the **pencil** button)
- URL
- Description
- Contact details

### Manage topics

- Add new topics (follow the steps from [creating a Partner Zone](#create-a-partner-zone))
- Change shared topic alias

:::warning[Changing existing topic alias]
If you change a topic alias **after it's been shared** with a partner, they won't be able to find the topic anymore and get an error. Only change shared topic names if you're sure that your partners are not using this topic.
:::

- Remove existing topics from the Partner Zone (click the **trash can** button next to the relevant topic under the **Topics** section).

:::info
 At least one topic has to exist in a Partner Zone, so you won't be able to delete the last topic via the UI. If you have to, [delete that Partner Zone](#delete-a-partner-zone).
:::

Click **Continue** when done.

### Update traffic control policies

Expand the **Traffic control policies** section by clicking on it. You can toggle the switch next to the policy you want to enable/disable and update the value.

Click **Save** in the top right corner when done.

</TabItem>
<TabItem value="Second Tab" label="Conduktor CLI">

1. Open the previously  created YAML file (e.g. `pz.yaml`) and make the required changes.

2. Use [Conduktor CLI](/gateway/reference/cli-reference/) to apply the changes:

    ```bash
    conduktor apply -f pz.yaml
    ```

</TabItem>
</Tabs>

## Delete a Partner Zone

<Tabs>
<TabItem value="First Tab" label="Console UI">
To delete a Partner Zone you can either:
- go to the Partner Zone page list view, and click the **three dots** on the right-hand side then click the **trash can** button
- or go to a specific Partner Zone's details view, click the **trash can** button in the top right corner.

Deleting a Partner Zone cannot be undone and will remove a partner's access.

A confirmation window will pop up. Enter `DELETE` to confirm the deletion. *This cannot be undone.*
</TabItem>

<TabItem value="Second Tab" label="Conduktor CLI">
Deleting a Partner Zone will remove a partner's access to it. *This can't be undone.*
  ```bash
     conduktor delete PartnerZone {name}
    ```
</TabItem>
</Tabs>

## Troubleshoot

<details>
  <summary>What does the Partner Zone status mean?</summary>
  <p>
  The status of a Partner Zone may be one of the following:
    - **Pending**: the configuration isn't deployed or refreshed yet
    - **Ready**: the configuration is up-to-date on Gateway
    - **Failed**: something unexpected happened during the deployment. Check that the connected Gateway is active
  </p>
</details>
<details>
  <summary>My Partner Zone creation failed, how do I find out what the issue is?</summary>
  <p>To check the status, [use the API](https://developers.conduktor.io/?product=console&version=1.31.2#tag/cli_partner-zone_console_v2_16/operation/get-partner-zone-by-name) to GET the state of the Partner Zone, or check the Gateway and Console logs.</p>
</details>
<details>
  <summary>Does **Generate password** invalidate the previously issued credentials of a service account?</summary>
  <p>No, you can't invalidate issued credentials - they instead have a set time to live. If you're concerned about any issued credentials, **delete and re-create the Partner Zone**, then re-issue fresh credentials. We recommend deploying Partner Zones using the IaC (Infrastructure as Code) approach. [Find out more on the resource reference page](/platform/reference/resource-reference/console/#partner-zone).</p>
</details>

## Audit log events

  | **Event type**                    | **Description**                                  |
  | --------------------------------- | ------------------------------------------------ |
  | **Admin.PartnerZone.Create**      | A Partner Zone is created.                       |
  | **Admin.PartnerZone.Update**      | A Partner Zone is updated.                       |
  | **Admin.PartnerZone.Delete**      | A Partner Zone is deleted.                       |
  | **Admin.PartnerZone.TokenCreate** | A token is created for accessing a Partner Zone. |

## Related resources

- [Connect to clusters](/platform/navigation/settings/managing-clusters/)
- [Manage service accounts](/platform/navigation/console/service-accounts/)
- [Gateway service accounts](/gateway/concepts/service-accounts-authentication-authorization/)
- [Give us feedback/request a feature](https://conduktor.io/roadmap)
