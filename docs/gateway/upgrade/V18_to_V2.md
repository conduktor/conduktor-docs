# Migrate interceptor

- Use new 1.8 version
- Create new topic for interceptor config
- V2 needs to use different interceptor config backing topic. Set value of **GATEWAY_INTERCEPTOR_STORE_BACKING_TOPIC
  ** to new topic above
- Pause creating topic mapping
- Call api to start migrate, wait til api success. Please ping us if api has error.
  Example:

```shell
curl -v\
    --silent \
    --request POST "http://localhost:8888/admin/migrateInterceptor/v1beta/from/18/to/2" \
    --user "superUser:superUser" \
    --header 'accept: application/json' \
    --header 'Content-Type: application/json' \
    --data-raw '{"sourceTopic": "_interceptorConfigs","destinationTopic": "_interceptorConfigs2"}'
```

- Start V2, test and monitor....
- Delete old topic when things work well.

# Migrate environment

- V2: all environment variables for config gateway now have GATEWAY_ prefix. Except:

| Old                               | New                        |
|-----------------------------------|----------------------------|
| PROXY_CLUSTER_ID                  | GATEWAY_CLUSTER_ID         |
| PROXY_BIND_HOST                   | GATEWAY_BIND_HOST          |
| PROXY_HOST                        | GATEWAY_HOST               |
| PROXY_HOST_PREFIX                 | GATEWAY_HOST_PREFIX        |
| PROXY_TENANT_IN_HOSTNAME          | GATEWAY_TENANT_IN_HOSTNAME |
| PROXY_PORT_RANGE                  | GATEWAY_PORT_RANGE         |
| PROXY_PORT                        | GATEWAY_PORT               |
| AUTHENTICATION_AUTHENTICATOR_TYPE | GATEWAY_SECURITY_PROTOCOL  |

- need to set **GATEWAY_FEATURE_FLAGS_MULTI_TENANCY** to true
- outdated environment variable: FEATURE_FLAGS_JWT_TOKEN_ENDPOINT

# Run V2