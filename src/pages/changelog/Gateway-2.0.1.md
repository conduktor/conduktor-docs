---
date: 2023-08-21
title: Improve error handling and robustness when scaling
description: The latest version of Conduktor Gateway introduces some fixes & improvements.
solutions: gateway
tags: fix
---

## General fixes 🔨

- Improved error handling on start: When faced with issues to do with missing keystores or inadequately configured port count, we'll throw you some better error messages
- Improved robustness of memory handling during network outages
- Improved robustness for the audit log
- Improved robustness when scaling
- Renamed `GATEWAY_HOST` to `GATEWAY_ADVERTISED_HOST` : Don't worry it will still work with the old value too!
- Include token detail on expiry: When tokens expire the token detail is provided in the expiry message
