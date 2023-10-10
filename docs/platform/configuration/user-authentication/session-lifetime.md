---
sidebar_position: 4
title: Session Lifetime
description: Configure idle session timeout and max session timeout
---

# Session Lifetime

## Overview

Conduktor uses long and short-lived tokens for verifying authenticated users. By default, the **maximum session life time is set to 3 days**. This means a user can close Conduktor and return before 3 days have expired to continue their session without needing to re-authenticate.

An additional configuration can be use to determine the **maximum idle session time** before a user becomes unauthenticated. The idle timeout represents the duration of the short-lived access token. This token will be refreshed periodically until either:
 - The maximum session lifetime is reached
 - You close Conduktor (e.g. the tab, or the browser) for a period that extends the idle timeout value.

If the idle timeout value is not set, the same value as the maximium session time will be used. You should ensure that the idle timeout value is always less than or equal to the maximum session lifetime. 


## Configuration

Use the below environment variables or [configuration properties](../env-variables.md#session-lifetime-properties) to configure your session lifetime requirements. 

Environment variables:

 - `CDK_AUTH_SESSIONLIFETIME`: **Max session lifetime in seconds**. Default is 3 days.
 - `CDK_AUTH_IDLETIMEOUT`: **Max idle session time in seconds** (access token lifetime). Note if this value is not set, the same value will be taken from `CDK_AUTH_SESSIONLIFETIME`. Should be lower than `CDK_AUTH_SESSIONLIFETIME`.
