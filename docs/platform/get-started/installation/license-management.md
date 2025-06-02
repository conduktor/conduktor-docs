---
sidebar_position: 2
title: Manage your license
description: Manage your Conduktor license for the Console
---

## Apply your license

We recommend applying your license to the environment variables. Alternatively, you can add it to your YAML config file.

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

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

:::info[Free access]
You don’t need a license to access the Community version of Conduktor. The Community plan allows you to manage and monitor any number of Kafka clusters but provides only limited access to powerful Conduktor features.

The unlicensed Conduktor Gateway version has a 14-day trial and will stop working when that period ends. [Contact us](https://conduktor.io/contact) to extend your trial or find out about licensing options.
:::

## Verify your license

Use Console to check that your license has been applied correctly. You can do this via the UI or by checking the logs.

### Use the UI

Log into Conduktor Console then go to **Settings** > **Plan**:

![Plan details](assets/plan-details.png)

### Use the logs

Run Console then check the logs in the head:

:::note[Console logs]
INFO  i.c.a.license.PlatformLicenseLoader - License Enterprise v3 is valid until 2026-01-31 00:00:00
:::

## License expiration

**30 days before expiration**: You will see a warning tag in the UI, at the top of each page, as well as next to the Plan tab.

![License expiration warning](assets/before-expiration.png)

**At expiration**: You will revert to the freemium plan and no longer enjoy the enterprise features. This may lead to errors in the UI and restricted actions.

## Renew or update your license

To renew an existing or apply a new license, change the `CDK_LICENSE` value in the environment variables (or the `license` value in the YAML file, depending on your setup) and re-deploy the Conduktor Console container.
