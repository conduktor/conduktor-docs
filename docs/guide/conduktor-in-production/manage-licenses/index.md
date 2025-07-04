---
sidebar_position: 70
id: index
title: Manage licenses 
description: Manage your Conduktor licenses
---

:::info[Free access]
You don’t need a license to access the Community version of Conduktor. The Community plan allows you to manage and monitor any number of Kafka clusters but provides only limited access to powerful Conduktor features.

The unlicensed Conduktor Gateway version has a 14-day trial and will stop working when that period ends. [Contact us](https://conduktor.io/contact) to extend your trial or find out about licensing options.
:::

## Apply your license

We recommend applying your license to the environment variables. Alternatively, you can add it to your YAML config file.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="First Tab" label="Use Console">

<Tabs>
<TabItem value="Environment Variables" label="Environment variables">

```js title=".env"
CDK_LICENSE='YOUR_LICENSE_HERE'
```

</TabItem>

<TabItem value="YAML  File" label="YAML file">

```yaml title="platform-config.yaml"
license: 'YOUR_LICENSE_HERE'
```

</TabItem>
</Tabs>

### Verify your license

Use Console to check that your license has been applied correctly. You can do this via the UI or by checking the logs.

#### Use the UI

Log into Conduktor Console then go to **Settings** > **Plan**:

![Plan details](/guide/plan-details.png)

#### Use the logs

Run Console then check the logs in the head: `License Enterprise is valid until 2026-01-01 00:00:00`.

:::note[Versions before 1.21]
Input configured license : Some("YOUR_LICENSE_HERE")
License is valid ! Remaining days : 365
:::

### Renew or update your license

To renew an existing or apply a new license, change the `CDK_LICENSE` value in the environment variables (or the `license` value in the YAML file, depending on your setup) and re-deploy the Conduktor Console container.

</TabItem>

<TabItem value="Second Tab" label="Use Gateway">

The license we provide to you has to be set as an environment variable in your Gateway configuration:

```js title=".env"
GATEWAY_LICENSE_KEY="YOUR_LICENSE_HERE"
```

### Verify your license

You can check that your license has been used to launch Gateway by looking at the license internal topic it has created.

The default name of this topic is `_conduktor_gateway_license`, but it might be different if:

- You have set another name via `GATEWAY_LICENSE_TOPIC`
- You have set the `GATEWAY_CLUSTER_ID`, then the topic will be `_conduktor_${GATEWAY_CLUSTER_ID}_license`.

In this topic, you'll find the license expiration date.

<Tabs>
<TabItem value="Enterprise plan" label="Enterprise plan">

```json
{
  "io.conduktor.proxy.avro.schema.AvroLicense.ConduktorLicense": {
    "token": "YOUR_LICENSE_HERE"
  }
}
```

</TabItem>

<TabItem value="Free plan" label="Free plan">

```json
{
  "io.conduktor.proxy.avro.schema.AvroLicense.FreeLicense": {
    "expirationDate": "1730280320532"
  }
}
```

</TabItem>
</Tabs>

And you can find the details of the license in the Gateway logs:

```md
2025-05-20T14:38:09.961+0000 [main] [INFO] [PersistentLicenseService:94] - Applied new license with expiry: 2026-01-01T00:00:00.000Z
```

### Renew or update your license

To change your license, change the `GATEWAY_LICENSE_KEY` environment variable and deploy the Conduktor Gateway container again.

</TabItem>
</Tabs>
