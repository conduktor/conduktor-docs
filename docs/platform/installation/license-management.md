---
sidebar_position: 6
title: License Management
description: This page provides guidence for how to install, verify and renew licenses for Conduktor Platform.
---

## License installation

Conduktor platform requires a license to enable features beyond the base features. The license can be put in the environment variables (this is recommended), or into the `platform-config.yaml` file.

### As an environment variable

In the `docker run` command, you can add the -e flag to specify your license key, like this:
`-e CDK_LICENSE="YOUR_LICENSE_HERE"`

If you have many environment variables, you can write them in a file, and load this file using the --env-file flag.
For example, you can create a file named `env.list` in which you write:

```
CDK_LICENSE="YOUR_LICENSE_HERE"
```

And then run the `docker run` command with `--env-file=env.list`

### Into the configuration file

On a far left justified line provide a `license` configuration declaration. Example:

```yaml
license: 'YOUR_LICENSE_HERE'
```

## License verification

You have multiple ways to check that your license has been used to launch the platform.

### In the logs

When you run the platform, you can find these meaningful logs in the head:

```
[ INFO  platform_cli::license::validator] Input configured license : Some("YOUR_LICENSE_HERE")
[ INFO  platform_cli::license::validator] License is valid ! Remaining days : 365
```

### With API

Since release `1.10.0` you can use the `/platform/api/license` endpoint to get the license details.
```sh
curl -s  http://localhost:8080/platform/api/license | jq .
```
Example of result:

```json
{
  "expire": 1669248000,
  "organization": "conduktor",
  "plan": "enterprise",
  "version": 1,
  "features": {
    "admin.auditlog.enable": true,
    "admin.enable": true,
    "console.enable": true,
    "datamasking.enable": true,
    "monitoring.alerting.enable": true,
    "monitoring.enable": true,
    "platform.clusters.limit": 5,
    "platform.rbac.enable": true,
    "platform.sso.enable": true,
    "testing.enable": true,
    "testing.tests.run.monthly.limit": -1,
    "topic.analyser.enable": true,
    "governance.enable": true
  }
}
```

### Within the Conduktor Platform container

You can get the same result as above from within the Conduktor Platform container with the following command:

```sh
curl -s  http://localhost:3000/platform/api/license
```

### In the UI

In the Admin section, you can find the Clusters tab where there is the information of how many clusters you can create in your Organization.

![](https://user-images.githubusercontent.com/112936799/212074277-4e015325-bd98-4f2a-be89-b8828be3eee1.png)

You can also check through the different tabs that you have access to all the products you're supposed to have access to.

## Renew or install a new license

To renew or install a new license, change the `license` configuration in the `platform-config.yaml` file, or the `CDK_LICENSE` environment variable, depending on what you used. Then deploy the Conduktor Platform container again.
