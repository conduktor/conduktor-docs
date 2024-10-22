---
sidebar_position: 5
title: Cortex Configuration
description: Cortex Configuration
---

:::caution
This Configuration is for Cortex dependency image `conduktor/conduktor-console-cortex`
:::

This image is exclusively configured through Environment Variables.  


The only required property is `CDK_CONSOLE-URL`, everything else is related to storage for the metrics.  


By default, data will be stored in `/var/conduktor/monitoring` inside the running image.
You can mount a volume on this folder to keep metrics data between updates.
Otherwise, you can use the storage parameters described below to store the data using either `s3`, `gcs`, `azure` or `swift`

| Environment Variable                          | Description                                                                                              | Mandatory | Type   | Default                 | Since    |
|-----------------------------------------------|----------------------------------------------------------------------------------------------------------|-----------|--------|-------------------------|----------|
| `CDK_CONSOLEURL`                              | Console URL and port (example: `"http://conduktor-console:8080"`)                                        | true      | string | ∅                       | `1.18.0` |
| `CDK_SCRAPER_SKIPSSLCHECK`                    | Disable TLS check when scraping metrics from Console                                                     | false     | bool   | `false`                 | `1.18.2` |
| `CDK_SCRAPER_CAFILE`                          | Path to CA certificate file inside the container to perform TLS check when scraping metrics from Console | false     | string | ∅                       | `1.18.2` |
| **S3**                                        |                                                                                                          |           |        |                         |          |
| `CDK_MONITORING_STORAGE_S3_ENDPOINT`          | S3 storage endpoint.                                                                                      | false     | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_S3_REGION`            | S3 storage region.                                                                                        | false     | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_S3_BUCKET`            | S3 storage bucket name.                                                                                   | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_S3_INSECURE`          | S3 storage SSL/TLS check flag.                                                                            | false     | bool   | `false`                 | `1.18.0` |
| `CDK_MONITORING_STORAGE_S3_ACCESSKEYID`       | Access key ID of an AWS IAM identity for Monitoring to upload logs to S3. If set to false, then if you are running on a Kubernetes deployment, Monitoring can attempt to leverage AWS IRSA for the Pod’s service account when connecting to S3.                                                                                                                       | false      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_S3_SECRETACCESSKEY`   | Secret access key of an AWS IAM identity for Monitoring to upload logs to S3. If set to false, then if you are running on a Kubernetes deployment, Monitoring can attempt to leverage AWS IRSA for the Pod’s service account when connecting to S3.                                                                            | false      | string | ∅                       | `1.18.0` |
| **GCS**                                       |                                                                                                          |           |        |                         |          |
| `CDK_MONITORING_STORAGE_GCS_BUCKETNAME`       | GCS storage bucket name                                                                                  | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_GCS_SERVICEACCOUNT`   | GCS storage service account JSON content                                                                 | true      | string | ∅                       | `1.18.0` |
| **Azure**                                     |                                                                                                          |           |        |                         |          |
| `CDK_MONITORING_STORAGE_AZURE_ACCOUNTNAME`    | Azure storage account name                                                                               | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_AZURE_ACCOUNTKEY`     | Azure storage account key                                                                                | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_AZURE_CONTAINERNAME`  | Azure storage container name                                                                             | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_AZURE_ENDPOINTSUFFIX` | Azure storage endpoint suffix                                                                            | false     | string | `blob.core.windows.net` | `1.18.0` |
| **Swift**                                     |                                                                                                          |           |        |                         |          |
| `CDK_MONITORING_STORAGE_SWIFT_AUTHURL`        | Swift storage authentication URL                                                                         | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_PASSWORD`       | Swift storage user password                                                                              | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_CONTAINERNAME`  | Swift storage container name                                                                             | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_USERID`         | Swift storage user ID                                                                                    | false     | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_USERNAME`       | Swift storage user name                                                                                  | false     | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_USERDOMAINNAME` | Swift storage user domain name                                                                           | false     | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_USERDOMAINID`   | Swift storage user domain ID                                                                             | false     | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_DOMAINID`       | Swift storage user domain ID                                                                             | false     | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_DOMAINNAME`     | Swift storage user domain name                                                                           | false     | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_PROJECTID`      | Swift storage project ID                                                                                 | false     | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_REGIONNAME`     | Swift storage region name                                                                                | false     | string | ∅                       | `1.18.0` |
| **Logs**                                      |                                                                                                          |           |        |                         |          |
| `CORTEX_ROOT_LOG_LEVEL`                       | Cortex log level                                                                                         | false     | string | `info`                  | `1.18.0` |
| `CORTEX_ALERT_ROOT_LOG_LEVEL`                 | Alert manager log level                                                                                  | false     | string | `info`                  | `1.18.0` |
| `PROMETHEUS_ROOT_LOG_LEVEL`                   | Prometheus log level                                                                                     | false     | string | `info`                  | `1.18.0` |

:::tip
Cortex [configuration](https://cortexmetrics.io/docs/configuration/configuration-file/) can be overridden completely by mounting a YAML file into path `/opt/override-configs/cortex.yaml`. You can also change the path location using the `CORTEX_OVERRIDE_CONFIG_FILE` environment variable.    
This is not currently available for Alert Manager and Prometheus. 
:::

In a docker compose it may look like the below:
````yaml
version: '3.8'
services:
  conduktor-console:
    image: conduktor/conduktor-console
    ports:
      - "8080:8080"
    environment: 
      CDK_MONITORING_CORTEX-URL: http://conduktor-monitoring:9009/
      CDK_MONITORING_ALERT-MANAGER-URL: http://conduktor-monitoring:9010/
      CDK_MONITORING_CALLBACK-URL: http://conduktor-console:8080/monitoring/api/
      CDK_MONITORING_NOTIFICATIONS-CALLBACK-URL: http://localhost:8080
  conduktor-monitoring:
    image: conduktor/conduktor-console-cortex
    ports:
      - "9009:9009" # cortex api
      - "9010:9010" # alertmanager api
      - "9090:9090" # prometheus api
    environment:
      CDK_CONSOLE-URL: "http://conduktor-console:8080"
````

## Troubleshooting  

### No metrics in the monitoring page  
Go to `http://localhost:9090/targets` to see Prometheus scraping target status. 

If it fails, check that you can query metrics endpoint from `conduktor-console-cortex` container. 

You might also have to configure `CDK_SCRAPER_SKIPSSLCHECK` or `CDK_SCRAPER_CAFILE` if `conduktor-console` is configured with [TLS termination](https-configuration.md#https-configuration).

### No Slack notification alerts
1. Follow the steps to configure Slack integration in the **Integrations** tab. You'll be asked to create a Slack App and to set OAuth2 authentication token on Console. 
2. Don't forget to manually add Slack App bot to the channel integrations you want to use for alerts notifications.
3. Enable notifications in the **Alerts** tab, and select the same channel as previously. 
4. [Create some alerts](../../navigation/monitoring/getting-started/create-alert.md).

If you still have issues with monitoring and alerting setup please [contact our support team](https://support.conduktor.io/). 
