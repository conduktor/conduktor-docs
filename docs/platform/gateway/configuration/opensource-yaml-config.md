---
title: Yaml Configuration 
description: Conduktor Gateway configuration via yaml
---

This page describes the valid yaml file configuration options for the opensource Conduktor Gateway (Enterprise documentation is in progress)

To configure the Enterprise Conduktor Gateway: refer to the [Environment Variables](./env-variables.md).

## Kafka Connection Configurations

```yaml
kafkaSelector:
  type: file
  path: the path to the file containing properties to connect gateway to the Kafka cluster
```

Example

```yaml
kafkaSelector:
  type: file
  path: gateway-core/config/kafka.config
```

## Interceptors

```yaml
- name: Unique name for this instance of the interceptor
  pluginClass: Fully qualified class name of the interceptor plugin
  priority: Priority for running this intercetpor.  0 is highest priority (run first), 2^32 is lowest.  If two interceptors have the same priority then the running order is indeterminate.
  config: Configuration for this interceptor
```

Example:

```yaml
- name: myLoggingInterceptor
  pluginClass: io.conduktor.example.loggerinterceptor.LoggerInterceptorPlugin
  priority: 100
  config:
    - key: "loggingStyle"
      value: "obiWan"
```

## Host/Port Configurations

```yaml
hostPortConfiguration:
  gatewayBindHost: the host to bind on
  gatewayHost: the host name of the gateway to be returned to clients
  portRange: a port range that gateway can assign to brokers
```

Example

```yaml
hostPortConfiguration:
  gatewayBindHost: 0.0.0.0
  gatewayHost: localhost
  portRange: 6969:6975
```

## Authentication Configurations

```yaml
authenticationConfig:
  authenticatorType: the authentication type for clients connecting to the gateway.  Value can be one of:
          NONE (unencrypted connection, no userid/password authentication)
          SSL (tls encrypted connection, no userid/password authentication
          SASL_PLAINTEXT (unencrypted connection, userid/password authentication)
          SASL_SSL (tls encrypted connection, userid/password authentication)
  sslConfig: required if SSL is specified in authenticatorType
    updateContextIntervalMinutes: the duration in minutes between checks for for SSL context changes (minimum 1)
    keyStore:
      keyStorePath: path to a SSL keystore
      keyStorePassword: the keystore password
      keyPassword: the key password
      keyStoreType: the keystore type (jks)
      updateIntervalMsecs: the interval to check for keystore changes e.g. 600000
  userPool: A list of user name and password pairs for users connecting to the gateway.  Required if SASL is set in authenticatorType
    - username: The username 
      password: The password for this username
```

Example:

```yaml
authenticationConfig:
  authenticatorType: SASL_SSL
  sslConfig:
    updateContextIntervalMinutes: 60
    keyStore:
      keyStorePath: config/kafka-gateway.keystore.jks
      keyStorePassword: keyStorePassw0rd
      keyPassword: keyPassw0rd
      keyStoreType: jks
      updateIntervalMsecs: 600000
  userPool:
    - username: alice
      password: passw0rd
    - unsername: bob
      password: alsoPassw0rd
```

[Open Source Security](./oss_security.md) describes the security considerations and settings in more detail.

## Thread Configurations

```yaml
threadConfig:
  downStreamThread: the thread pool size for handling downstream connections (connections from Kafka clients)
  upstream:
    numberOfThread: the thread pool size for handling upstream connections (connections to Kafka brokers)
    maxPendingTask: the maximum pending upstream tasks before new tasks will be rejected
```

Example

```yaml
threadConfig:
  downStreamThread: 2
  upstream:
    numberOfThread: 2
    maxPendingTask: 2048
```

## Upstream Connection Configurations

```yaml
upstreamConnectionConfig:
  numOfConnection: the number of connections made to each upstream Kafka broker
  maxIdleTimeMs: the maximum time a connection can remain idle before it will be reaped
```

Example

```yaml
upstreamConnectionConfig:
  numOfConnection: 10
  maxIdleTimeMs: 200000
```

## Request Handling Configurations

```yaml
maxResponseLatency: the maximum time gateway will wait for a response from Kafka
inFlightRequestExpiryMs: the maximum total time to process a request in gateway before it will be rejected
```

Example:

```yaml
maxResponseLatency: 3000
inFlightRequestExpiryMs: 30000
```


