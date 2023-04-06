---
title: Environment Variables
description: Conduktor Proxy connections to Kafka are configured by prefixed and translated environment variables.
---




``yaml
kafkaSelector:
file:
path:  - the path to the file containing Kafka connection properties e.g. config/kafka.config
```

### Routing Configurations
```yaml
routing: - how Conduktor Gateway should map incoming connections to backing cluster connections. Options are host/port
```

### Host/Port Configurations
```yaml
hostPortConfiguration:
  gatewayBindHost: - the host to bind on e.g. 0.0.0.0
  gatewayHost: - the host name of the gateway to be returned to clients e.g. localhost
  hostPrefix: - a prefix for broker host names when using host routsing. e.g. broker
  portRange: - a port range that gateway can assign to brokers when using port routing e.g. 6969:6975
  gatewayPort: - the port on which gateway should accept connections when using host routing e.g. 6969
```

### Authentication Configurations
```yaml
authenticationConfig:
  authenticatorType: - the authentication type for client <--> gateway e.g. NONE
  exponentialBackoff:
    multiplier: - backoff multiplier for failed authentication attempts e.g. 2
    backoffMaxMs: - maximum backoff time e.g. 5000
  sslConfig:
    updateContextIntervalMinutes: - the interval to check for for SSL context changes e.g. 5
    keyStore:
      keyStorePath: - path to a SSL keystore  e.g. config/kafka-gateway.keystore.jks
      keyStorePassword: - the keystore password 
      keyPassword: - the key password
      keyStoreType: - the keystore type e.g. jks
      updateIntervalMsecs: - the interval to check for keystore changes e.g. 600000
```

### Thread Configurations
```yaml
threadConfig:
  downStreamThread: - the thread pool size for handling downstream connections e.g. 2
  upstream:
    numberOfThread: - the thread pool size for handling upstream connections e.g. 2
    maxPendingTask: - the maximum pending upstream takss before new tasks will be rejected e.g. 2048
```

### Request Handling Configurations
```yaml
maxResponseLatency: - the maximum time gateway will wait for a response from Kafka e.g. 3000
inFlightRequestExpiryMs: - the maximum total time to process a request in gateway before it will be rejected e.g. 30000
```

### Upstream Connection Configurations

```yaml
upstreamConnectionConfig:
  numOfConnection: - the number of connections made to each upstream Kafka broker e.g. 10
  maxIdleTimeMs: - the maximum time a connection can remain idle before it will be reaped e.g. 200000
```

