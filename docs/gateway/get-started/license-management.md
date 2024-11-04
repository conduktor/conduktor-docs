---
sidebar_position: 4
title: License Management
description: Configure the Conduktor Enterprise license with your Gateway
---

## License installation

In order to enjoy your Enterprise Gateway plan, you'll have to configure all your Gateways to use the license key we provided to you.

This license has to be set as an environment variable in your Gateway configuration:

```js title=".env"
GATEWAY_LICENSE_KEY="YOUR_LICENSE_HERE"
```

## License verification

You can check that your license has been used to launch the Gateway by looking at the license internal topic it has created.

The default name of this topic is `_conduktor_gateway_license`, but it might be different if:
- You have set another name via `GATEWAY_LICENSE_TOPIC`
- You have set the `GATEWAY_CLUSTER_ID`, then the topic will be `_conduktor_$GATEWAY_CLUSTER_ID_license`.

In this topic, you'll find the license expiration date.

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="Enterprise plan" label="Enterprise plan">

```json title="Enterprise plan"
{
	"io.conduktor.proxy.avro.schema.AvroLicense.ConduktorLicense": {
		"token": "YOUR_LICENSE_HERE"
	}
}
```

</TabItem>
<TabItem value="Free plan" label="Free plan">

```json title="Free plan"
{
	"io.conduktor.proxy.avro.schema.AvroLicense.FreeLicense": {
		"expirationDate": "1730280320532"
	}
}
```

</TabItem>
</Tabs>

And you can find the details of the license in the Gateway logs:

```
2024-11-01T14:38:09.961+0000 [main] [INFO] [PersistentLicenseService:94] - Applied new license with expiry: 2026-01-01T00:00:00.000Z
```


## Change the License

To replace your license, change the `GATEWAY_LICENSE_KEY` environment variable and deploy the Conduktor Gateway container again.
