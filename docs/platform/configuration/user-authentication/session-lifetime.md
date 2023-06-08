---
sidebar_position: 3
title: Session Lifetime
description: Configure idle session timeout and max session timeout
---

# Session Lifetime

## Overview

Conduktor uses long and short-lived tokens for verifying authenticated users. By default, the **maximum session life time is set to 3 days**. This means a user can close Conduktor and return before 3 days have expired and continue their session.

An aditional configuration can be use to determine the **maximum idle (inactive) session time** before a user becomes unauthenticated. If this value is not set, the same value as the maximium session time will be taken. 


## Configuration

Use the below environment variables or [configuration properties](../env-variables.md#session-lifetime-properties) to configure your session lifetime requirements. 

Environment variables:

 - `CDK_AUTH_SESSIONLIFETIME`: **Max session lifetime in seconds**. Default is 3 days.
 - `CDK_AUTH_IDLETIMEOUT`: **Max idle (inactive) session time in seconds** (access token lifetime). Note if this value is not set, the same value will be taken from `CDK_AUTH_SESSIONLIFETIME`.