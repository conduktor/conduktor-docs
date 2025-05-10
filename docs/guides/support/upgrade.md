---
sidebar_position: 410
title: Upgrade
description: Find out how to upgrade to the latest Conduktor version
---

Upgrade to the latest Conduktor version.

## Release cadence

Conduktor plans to provide a new release at least monthly. We suggest that upgrades are done no more than two versions apart at a time.

[Subscribe to get notified about new releases](https://support.conduktor.io/hc/en-gb/articles/20131942687889-How-to-get-notified-when-there-is-a-new-version-of-Conduktor-Console-or-Gateway).

## Upgrade process

Conduktor is released as a Docker container. To upgrade from one release to the next (in production):

1. Make a database dump (just in case you need to roll-back).

1. Pull the latest image from Docker hub:

```bash
docker pull conduktor/conduktor-console
```

1. Change the version of your container (either in your docker-compose, or helm chart) and deploy it again.

1. Check the logs and the UI to ensure the upgrade was successful.

## Related resources

- [View our version policy](/support)
