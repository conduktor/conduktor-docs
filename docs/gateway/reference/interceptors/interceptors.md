---
title: Configuring Interceptors
description: 
---

## Configuring Interceptors

Interceptors are configured in `application.yaml` under the `interceptors` field. Each interceptor definition must have the following properties:

```yaml
name: - A unique name used to describe this interceptor
pluginClass: - The fully qualified Java class name of the Plugin implementation that defines this interceptor
priority: - an integer value signifying the ordering of this interceptor compared with others (0 is highest priority)
config: - a set of key value pairs that will be passed to the interceptor when created.
```

For example:

```yaml
interceptors:
- name: loggingInterceptor
  pluginClass: io.conduktor.example.loggerinterceptor.LoggerInterceptorPlugin
  priority: 100
  config:
    - key: "loggingStyle"
      value: "obiWan"
```