---
sidebar_position: 210
title: Session lifetime 
description: Session lifetime in Conduktor
---
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

## Session lifetime overview

Conduktor uses long and short-lived tokens to verify authenticated users. By default, **the maximum session lifetime is three days**. This means that you can close Console and return within the three day window to continue your session without needing to re-authenticate.

You can also configure **the maximum idle session time** before a user becomes unauthenticated. The idle timeout represents the duration of the short-lived access token. This token will be refreshed periodically until either:

- the maximum session lifetime is reached or
- you close Conduktor for a period that extends the idle timeout value.

If the idle timeout value is not set, the same value as the maximum session time will be used. We recommend ensuring that **the idle timeout value is always less than or equal to the maximum session lifetime**.

### Configuration

Use the environment variables or configuration properties to configure your session lifetime requirements.

<Tabs>
<TabItem  value="Environment variables" label="Environment variables">

- `CDK_AUTH_SESSIONLIFETIME`: Max session lifetime in seconds. The default is 3 days.
- `CDK_AUTH_IDLETIMEOUT`: Max idle session time in seconds (access token lifetime). If this value is not set, the same value will be taken from `CDK_AUTH_SESSIONLIFETIME`. Should be lower than `CDK_AUTH_SESSIONLIFETIME`.
</TabItem>

<TabItem  value="Config properties" label="Config properties">

| Property               | Description                                                                                           | Environment Variable       | Mandatory | Type | Default value |
|------------------------|-------------------------------------------------------------------------------------------------------|----------------------------|-----------|------|---------------|
| `auth.sessionLifetime` | Max session lifetime in seconds                                                                       | `CDK_AUTH_SESSIONLIFETIME` | false     | int  | `259200`      |
| `auth.idleTimeout`     | Max idle session time in seconds (access token lifetime). Should be lower than `auth.sessionLifetime` | `CDK_AUTH_IDLETIMEOUT`     | false     | int  | `259200`      |

</TabItem>
</Tabs>
