---
sidebar_position: 4
title: Upgrading
description: Consider is available as Docker image.
---

# Upgrading

### Release cadence

Conduktor plans to provide a new release at least monthly. We suggest that upgrades are done no more than two versions apart at a time.

You can subscribe to release notifications [here](https://support.conduktor.io/hc/en-gb/sections/16400521075217-Releases).

### Upgrade process

Conduktor is released as a Docker container, the process for upgrading from one release to the next is:

```sh
docker pull conduktor/conduktor-console
docker restart conduktor/conduktor-console
```
