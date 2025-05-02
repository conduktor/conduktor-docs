---
sidebar_position: 7
title: HTTPS Configuration
description: Specify HTTPS configuration that Conduktor Platform use to respond to HTTPS requests.
---

# HTTPS Configuration
To configure Conduktor Console to respond to HTTPS requests, you have to define a certificate and a private key.
The server certificate is a public entity. It is sent to every client that connects to the server, and it should be provided as a PEM file.

Configuration properties are: 
- `platform.https.cert.path` or environment variable `CDK_PLATFORM_HTTPS_CERT_PATH` : path to server certificate file
- `platform.https.key.path` or environment variable `CDK_PLATFORM_HTTPS_KEY_PATH` : path to server private key file  

:::note
The certificate and private key files must allow read from user `conduktor-platform` (uid 10001 gid 0), but don't need to be readable system-wide.
:::

## Example configuration using docker-compose

In this example server certificate and key are stored in files `server.crt` and `server.key` in the same directory as the docker-compose file.

```yaml
services:
  conduktor-console:
    image: conduktor/conduktor-console
    ports:
      - 8080:8080
    volumes: 
      - type: bind
        source: ./server.crt
        target: /opt/conduktor/certs/server.crt
        read_only: true
      - type: bind
        source: ./server.key
        target: /opt/conduktor/certs/server.key
        read_only: true
    environment:
      CDK_PLATFORM_HTTPS_CERT_PATH: '/opt/conduktor/certs/server.crt'
      CDK_PLATFORM_HTTPS_KEY_PATH: '/opt/conduktor/certs/server.key'
```

In the case of the Monitoring image `conduktor/conduktor-console-cortex` running as well, you need to provide the CA public certificate to the monitoring image to allow metrics scraping on HTTPS. 

```yaml
 services:
   conduktor-console:
     image: conduktor/conduktor-console
     ports:
       - 8080:8080
     volumes:
       - type: bind
         source: ./server.crt
         target: /opt/conduktor/certs/server.crt
         read_only: true
       - type: bind
         source: ./server.key
         target: /opt/conduktor/certs/server.key
         read_only: true
     environment:
       # HTTPS configuration
       CDK_PLATFORM_HTTPS_CERT_PATH: '/opt/conduktor/certs/server.crt'
       CDK_PLATFORM_HTTPS_KEY_PATH: '/opt/conduktor/certs/server.key'
       # monitoring configuration
       CDK_MONITORING_CORTEX-URL: http://conduktor-monitoring:9009/
       CDK_MONITORING_ALERT-MANAGER-URL: http://conduktor-monitoring:9010/
       CDK_MONITORING_CALLBACK-URL: https://conduktor-console:8080/monitoring/api/
       CDK_MONITORING_NOTIFICATIONS-CALLBACK-URL: http://localhost:8080
       
   conduktor-monitoring:
     image: conduktor/conduktor-console-cortex
     volumes:
       - type: bind
         source: ./server.crt
         target: /opt/conduktor/certs/server.crt
         read_only: true
     environment:
       CDK_CONSOLE-URL: "https://conduktor-console:8080"
       CDK_SCRAPER_SKIPSSLCHECK: "false" # can be set to true if you don't want to check the certificate
       CDK_SCRAPER_CAFILE: "/opt/conduktor/certs/server.crt"
```
