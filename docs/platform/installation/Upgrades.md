---
sidebar_position: 1
title: Upgrading Conduktor Platform
description: Consider using Conduktor Cloud to not worry about installation, upgrade or software administration.
---

# Upgrading Conduktor Platform.

Consider using Conduktor Cloud to not worry about installation, upgrade or software administration.

### Release cadence

Conduktor plans to provide a new release at least monthly. We suggest that upgrades are done at least bi-monthly.

### Upgrade process

Conduktor Platform is released as a Docker container, the process for upgrading from one release to the next is:

```sh
docker pull conduktor/conduktor-platform
docker restart conduktor/conduktor-platform
```
