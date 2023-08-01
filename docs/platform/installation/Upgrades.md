---
sidebar_position: 4
title: Upgrading
description: Consider is available as Docker image.
---

# Upgrading


Consider using Conduktor Cloud to not worry about installation, upgrade or software administration.

### Release cadence

Conduktor plans to provide a new release at least monthly. We suggest that upgrades are done no more than two versions apart at a time.

### Upgrade process

Conduktor is released as a Docker container, the process for upgrading from one release to the next is:

```sh
docker pull conduktor/conduktor-platform
docker restart conduktor/conduktor-platform
```
