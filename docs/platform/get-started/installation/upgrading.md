---
sidebar_position: 4
title: Upgrading
description: Consider is available as Docker image.
---

# Upgrading

### Release cadence

Conduktor plans to provide a new release at least monthly. We suggest that upgrades are done no more than two versions apart at a time.

You can subscribe to release notifications [here](https://support.conduktor.io/hc/en-gb/sections/16400553827473-Conduktor-Console).

### Upgrade process

Conduktor is released as a Docker container, the process for upgrading from one release to the next in production is:

1. Make a database dump, in case you need to rollback.

2. Pull the latest image from Docker Hub.

```bash
docker pull conduktor/conduktor-console
```

3. Change the version of your container (either in your docker-compose, or helm chart), and deploy it again.

4. Check the logs and the UI to ensure the upgrade was successful.