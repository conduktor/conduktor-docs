---
sidebar_position: 4
title: Manage your license
description: Manage your Conduktor license for Gateway
---

## Apply your license

In order to enjoy your Enterprise Gateway plan, you'll have to configure all your Gateways to use the license key we provided to you.

This license has to be set as an environment variable in your Gateway configuration:

```js title=".env"
GATEWAY_LICENSE_KEY="YOUR_LICENSE_HERE"
```

## Verify your license

### In Kafka

You can check that your license has been used to launch the Gateway by looking at the license internal topic it has created.

The default name of this topic is `_conduktor_gateway_license`, but it might be different if:
- You have set another name via `GATEWAY_LICENSE_TOPIC`
- You have set the `GATEWAY_CLUSTER_ID`, then the topic will be `_conduktor_${GATEWAY_CLUSTER_ID}_license`.

In this topic, you'll find the license expiration date.

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

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

### In the Gateway logs

You can check that your license has been applied correctly by looking at the Gateway logs.

When the Gateway starts, it will log the license information:

:::note[Gateway logs]
[INFO] [PersistentLicenseService:114] - Applied new license with expiry: 2026-06-29T00:00:00.000Z

[INFO] [PersistentLicenseService:86] - Enterprise license found, valid until: 2026-06-29T00:00:00.000Z
:::

### In the Gateway metrics

You can monitor the days left before expiration using this metric from the [Gateway metrics endpoint](/gateway/reference/monitoring/#how-to-access-prometheus-metrics-from-gateway): `gateway.license.remaining_days`.

We highly recommend you to set up an alert for when the license is about to expire.

## License expiration

**One week before expiration**, you'll see this warning in your logs:

:::note[License expiration warning]
License will expire in less than X day(s)! You need to renew your license to continue using Conduktor Gateway. Checkout our documentation (https://docs.conduktor.io/gateway/get-started/license-management/) if unsure how to set the license.
:::

**After expiration**, the Gateway will continue running and log a warning every hour that your license has expired:

:::note[License expired warning]
License has expired! You need to add a valid license to continue using Conduktor Gateway. Checkout our documentation if unsure how to set the license.
:::

The Gateway container will then fail on restart with a "license expired error".

## Change the License

To replace your license, change the `GATEWAY_LICENSE_KEY` environment variable and deploy the Conduktor Gateway container again.
