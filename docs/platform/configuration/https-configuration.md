---
sidebar_position: 7
title: HTTPS Configuration
description: Specify HTTPS configuration that Conduktor Platform use to respond to HTTPS requests.
---

# HTTPS Configuration
To configure Conduktor Platform to respond to HTTPS requests, you have to define a certificate and a private key.
The server certificate is a public entity. It is sent to every client that connects to the server, and they should be provided as a PEM file.

Configuration properties are: 
- `platform.https.cert.path` or environment variable `CDK_PLATFORM_HTTPS_CERT_PATH` : path to server certificate file
- `platform.https.key.path` or environment variable `CDK_PLATFORM_HTTPS_KEY_PATH` : path to server private key file  

> **Note** : Certificate and private key files don't need to be readable system-wide but they must allow read from
user `conduktor-platform` (uid `10001`).

## Example configuration using docker-compose

In this example server certificate and key are stored in files `server.crt` and `server.key` in the same directory as the docker-compose file.

```yaml
version: '3.8'
services:
  conduktor-platform:
    image: conduktor/conduktor-platform:latest
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
