# Prepare a v2 version to deploy
As part of the migration a swap from v1 to v2 requires a v2 ready to deploy, it's recommended to have this prepared how you expect it to behave in advance of modifying the running v1 to minimise any potential disruption time.

- V2: many if not all environment variables that are for configuring Gateway now have a GATEWAY_ prefix, with Kafka variables prefixed KAFKA_, same as before.

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

In v2 there are a small number of additional environment variables you will need to set to change the OOTB behaviour;
- Set **GATEWAY_FEATURE_FLAGS_MULTI_TENANCY** to true, default is Passthrough
- `GATEWAY_SECURITY_PROTOCOL` (previously `AUTHENTICATION_AUTHENTICATOR_TYPE`) needs to use `SASL_PLAINTEXT` instead of `SASL_PLAIN` , if used

Some environemnt variables are deprecated, or you are likely using default values, environment variable e.g. the following is removed `FEATURE_FLAGS_JWT_TOKEN_ENDPOINT`

Recommended to test a temporary instance in a dev environment to have the config you need. We're happy to help answer specific questions on -e or otherwise.
# Migrate interceptors

- Be sure to be running a version of v1 that supports the planned upgrade, at least 1.8.2.15
- Create a new topic for interceptor configs.
  - As V2 needs to use a different interceptor config backing topic to that of v1, they can't be combined, we'll need a new topic or to clear the contents of the old one if you are not using it with v1. The default value you are probably using for `GATEWAY_INTERCEPTOR_STORE_BACKING_TOPIC` is `_interceptorConfigs` , so perhaps `_interceptorConfigsV2` which can be used moving forward. We would assume bugs might occur if there are interceptor configs from v1 present and v2 tries to use that same config topic.

  # Migrate
  At this point you should have a GW v2 deployment config ready.

- Pause creating new topic mappings
- Call the migration API, wait for success. Please ping us if you get any error.
  Example:

```shell
curl -v\
    --silent \
    --request POST "http://localhost:8888/admin/migrateInterceptor/v1beta/from/18/to/2" \
    --user "superUser:superUser" \
    --header 'accept: application/json' \
    --header 'Content-Type: application/json' \
    --data-raw '{"sourceTopic": "_interceptorConfigs","destinationTopic": "_interceptorConfigsV2"}'
```
- *Stop V1 completely?*
- Start V2, test and monitor....
- Delete old topic configs when things work well. Preseve these elsewhere if you wish for a backup for later inspection;

# Renew auth tokens for clients

Clients will needs to use an updated jwt token and hence password to use the new API to retrieve an auth token. The Admin API has changed so please use the latest on, https://developers.conduktor.io/#tag/Virtual-Clusters/operation/Auth_v1_createClusterAccountToken

As discussed, the recommended best practice is a username on a virtual cluster(tenant), from discussing the design you wish to acheive with your existing tenants you can use a `1username`:`1tenant` setup to acheive the same result you have worked with before.

# Upgrade complete
Upgrade complete.