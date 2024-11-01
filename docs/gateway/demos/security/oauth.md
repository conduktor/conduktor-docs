---
title: Oauth
description: Oauth
tag: security
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# What is OAuth

You can be using OAuth instead of SASL_SSL

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/UabCbOYKNHqlDMkma4RuoLC1B.svg)](https://asciinema.org/a/UabCbOYKNHqlDMkma4RuoLC1B)

</TabItem>
</Tabs>

## Review the docker compose environment

As can be seen from `docker-compose.yaml` the demo environment consists of the following services:

* gateway1
* gateway2
* kafka-client
* kafka1
* kafka2
* kafka3
* keycloack
* schema-registry

<Tabs>
<TabItem value="Command">

```sh
cat docker-compose.yaml
```

</TabItem>
<TabItem value="File Content">

```yaml
services:
  kafka1:
    image: confluentinc/cp-server:7.5.0
    hostname: kafka1
    container_name: kafka1
    ports:
    - 9092:9092
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_LISTENERS: INTERNAL://kafka1:29092,CONTROLLER://kafka1:29093,EXTERNAL://0.0.0.0:9092
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka1:29092,EXTERNAL://localhost:9092
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka1:29093,2@kafka2:29093,3@kafka3:29093
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
      CLUSTER_ID: p0KPFA_mQb2ixdPbQXPblw
    healthcheck:
      test: nc -zv kafka1 29092 || exit 1
      interval: 5s
      retries: 25
  kafka2:
    image: confluentinc/cp-server:7.5.0
    hostname: kafka2
    container_name: kafka2
    ports:
    - 9093:9093
    environment:
      KAFKA_NODE_ID: 2
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_LISTENERS: INTERNAL://kafka2:29092,CONTROLLER://kafka2:29093,EXTERNAL://0.0.0.0:9093
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka2:29092,EXTERNAL://localhost:9093
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka1:29093,2@kafka2:29093,3@kafka3:29093
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
      CLUSTER_ID: p0KPFA_mQb2ixdPbQXPblw
    healthcheck:
      test: nc -zv kafka1 29092 || exit 1
      interval: 5s
      retries: 25
  kafka3:
    image: confluentinc/cp-server:7.5.0
    hostname: kafka3
    container_name: kafka3
    ports:
    - 9094:9094
    environment:
      KAFKA_NODE_ID: 3
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_LISTENERS: INTERNAL://kafka3:29092,CONTROLLER://kafka3:29093,EXTERNAL://0.0.0.0:9094
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka3:29092,EXTERNAL://localhost:9094
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka1:29093,2@kafka2:29093,3@kafka3:29093
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
      CLUSTER_ID: p0KPFA_mQb2ixdPbQXPblw
    healthcheck:
      test: nc -zv kafka3 29092 || exit 1
      interval: 5s
      retries: 25
  schema-registry:
    image: confluentinc/cp-schema-registry:latest
    hostname: schema-registry
    container_name: schema-registry
    ports:
    - 8081:8081
    environment:
      SCHEMA_REGISTRY_HOST_NAME: schema-registry
      SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS: kafka1:29092,kafka2:29092,kafka3:29092
      SCHEMA_REGISTRY_LOG4J_ROOT_LOGLEVEL: WARN
      SCHEMA_REGISTRY_LISTENERS: http://0.0.0.0:8081
      SCHEMA_REGISTRY_KAFKASTORE_TOPIC: _schemas
      SCHEMA_REGISTRY_SCHEMA_REGISTRY_GROUP_ID: schema-registry
    volumes:
    - type: bind
      source: .
      target: /clientConfig
      read_only: true
    depends_on:
      kafka1:
        condition: service_healthy
      kafka2:
        condition: service_healthy
      kafka3:
        condition: service_healthy
    healthcheck:
      test: nc -zv schema-registry 8081 || exit 1
      interval: 5s
      retries: 25
  gateway1:
    image: conduktor/conduktor-gateway:3.3.2
    hostname: gateway1
    container_name: gateway1
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:29092,kafka2:29092,kafka3:29092
      GATEWAY_ADVERTISED_HOST: localhost
      GATEWAY_SECURITY_PROTOCOL: SASL_PLAINTEXT
      GATEWAY_FEATURE_FLAGS_ANALYTICS: false
      GATEWAY_OAUTH_JWKS_URL: http://keycloak:18080/realms/conduktor/protocol/openid-connect/certs
      GATEWAY_OAUTH_EXPECTED_ISSUER: http://keycloak:18080/realms/conduktor
    depends_on:
      kafka1:
        condition: service_healthy
      kafka2:
        condition: service_healthy
      kafka3:
        condition: service_healthy
    ports:
    - 6969:6969
    - 6970:6970
    - 6971:6971
    - 6972:6972
    - 8888:8888
    healthcheck:
      test: curl localhost:8888/health
      interval: 5s
      retries: 25
  gateway2:
    image: conduktor/conduktor-gateway:3.3.2
    hostname: gateway2
    container_name: gateway2
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:29092,kafka2:29092,kafka3:29092
      GATEWAY_ADVERTISED_HOST: localhost
      GATEWAY_SECURITY_PROTOCOL: SASL_PLAINTEXT
      GATEWAY_FEATURE_FLAGS_ANALYTICS: false
      GATEWAY_OAUTH_JWKS_URL: http://keycloak:18080/realms/conduktor/protocol/openid-connect/certs
      GATEWAY_OAUTH_EXPECTED_ISSUER: http://keycloak:18080/realms/conduktor
    depends_on:
      kafka1:
        condition: service_healthy
      kafka2:
        condition: service_healthy
      kafka3:
        condition: service_healthy
    ports:
    - 7969:6969
    - 7970:6970
    - 7971:6971
    - 7972:6972
    - 8889:8888
    healthcheck:
      test: curl localhost:8888/health
      interval: 5s
      retries: 25
  kafka-client:
    image: confluentinc/cp-kafka:latest
    hostname: kafka-client
    container_name: kafka-client
    command: sleep infinity
    volumes:
    - type: bind
      source: .
      target: /clientConfig
      read_only: true
  keycloack:
    image: quay.io/keycloak/keycloak:22.0
    hostname: keycloak
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    container_name: keycloak
    volumes:
    - type: bind
      source: conduktor-realm.json
      target: /opt/keycloak/data/import/realm.json
      read_only: true
    ports:
    - 18080:18080
    command:
    - start-dev
    - --http-port 18080
    - --hostname=keycloak
    - --metrics-enabled=true
    - --health-enabled=true
    - --import-realm
```
</TabItem>
</Tabs>

## Starting the docker environment

Start all your docker processes, wait for them to be up and ready, then run in background

* `--wait`: Wait for services to be `running|healthy`. Implies detached mode.
* `--detach`: Detached mode: Run containers in the background






<Tabs>

<TabItem value="Command">
```sh
docker compose up --detach --wait
```


</TabItem>
<TabItem value="Output">

```
 Network oauth_default  Creating
 Network oauth_default  Created
 Container kafka-client  Creating
 Container kafka3  Creating
 Container keycloak  Creating
 Container kafka2  Creating
 Container kafka1  Creating
 Container kafka1  Created
 Container keycloak  Created
 Container kafka-client  Created
 Container kafka3  Created
 Container kafka2  Created
 Container gateway2  Creating
 Container gateway1  Creating
 Container schema-registry  Creating
 Container gateway1  Created
 Container schema-registry  Created
 Container gateway2  Created
 Container kafka-client  Starting
 Container kafka3  Starting
 Container kafka1  Starting
 Container kafka2  Starting
 Container keycloak  Starting
 Container kafka2  Started
 Container kafka3  Started
 Container kafka1  Started
 Container kafka1  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka3  Waiting
 Container kafka2  Waiting
 Container kafka-client  Started
 Container keycloak  Started
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container gateway2  Starting
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container gateway1  Starting
 Container schema-registry  Starting
 Container gateway2  Started
 Container gateway1  Started
 Container schema-registry  Started
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container keycloak  Waiting
 Container kafka3  Healthy
 Container keycloak  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka-client  Healthy
 Container schema-registry  Healthy
 Container gateway1  Healthy
 Container gateway2  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/XJO5yv2cQtAD7gP0NySSIeI5T.svg)](https://asciinema.org/a/XJO5yv2cQtAD7gP0NySSIeI5T)

</TabItem>
</Tabs>

## Review the kafka properties to connect using OAuth

Review the kafka properties to connect using OAuth

<Tabs>
<TabItem value="Command">

```sh
cat user-1.properties
```

</TabItem>
<TabItem value="File Content">

```properties
sasl.mechanism=OAUTHBEARER
sasl.login.callback.handler.class=org.apache.kafka.common.security.oauthbearer.secured.OAuthBearerLoginCallbackHandler
sasl.oauthbearer.token.endpoint.url=http://localhost:18080/realms/conduktor/protocol/openid-connect/token
sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required clientId="m2m" clientSecret="m2m" scope="email gateway";
security.protocol=SASL_PLAINTEXT
```
</TabItem>
</Tabs>

## Creating topic cars on gateway1

Creating on `gateway1`:

* Topic `cars` with partitions:1 and replication-factor:1






<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config user-1.properties \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic cars
```


</TabItem>
<TabItem value="Output">

```
[2024-10-29 22:17:15,438] WARN Error during retry attempt 1 (org.apache.kafka.common.security.oauthbearer.internals.secured.Retry)
java.util.concurrent.ExecutionException: java.net.SocketException: Unexpected end of file from server
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.lambda$retrieve$0(HttpAccessTokenRetriever.java:171)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.Retry.execute(Retry.java:70)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.retrieve(HttpAccessTokenRetriever.java:160)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginCallbackHandler.handleTokenCallback(OAuthBearerLoginCallbackHandler.java:243)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginCallbackHandler.handle(OAuthBearerLoginCallbackHandler.java:232)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule.identifyToken(OAuthBearerLoginModule.java:316)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule.login(OAuthBearerLoginModule.java:301)
	at java.base/javax.security.auth.login.LoginContext.invoke(LoginContext.java:726)
	at java.base/javax.security.auth.login.LoginContext$4.run(LoginContext.java:665)
	at java.base/javax.security.auth.login.LoginContext$4.run(LoginContext.java:663)
	at java.base/java.security.AccessController.doPrivileged(AccessController.java:691)
	at java.base/javax.security.auth.login.LoginContext.invokePriv(LoginContext.java:663)
	at java.base/javax.security.auth.login.LoginContext.login(LoginContext.java:574)
	at org.apache.kafka.common.security.oauthbearer.internals.expiring.ExpiringCredentialRefreshingLogin.login(ExpiringCredentialRefreshingLogin.java:204)
	at org.apache.kafka.common.security.oauthbearer.internals.OAuthBearerRefreshingLogin.login(OAuthBearerRefreshingLogin.java:150)
	at org.apache.kafka.common.security.authenticator.LoginManager.<init>(LoginManager.java:62)
	at org.apache.kafka.common.security.authenticator.LoginManager.acquireLoginManager(LoginManager.java:105)
	at org.apache.kafka.common.network.SaslChannelBuilder.configure(SaslChannelBuilder.java:170)
	at org.apache.kafka.common.network.ChannelBuilders.create(ChannelBuilders.java:192)
	at org.apache.kafka.common.network.ChannelBuilders.clientChannelBuilder(ChannelBuilders.java:81)
	at org.apache.kafka.clients.ClientUtils.createChannelBuilder(ClientUtils.java:119)
	at org.apache.kafka.clients.ClientUtils.createNetworkClient(ClientUtils.java:223)
	at org.apache.kafka.clients.ClientUtils.createNetworkClient(ClientUtils.java:189)
	at org.apache.kafka.clients.admin.KafkaAdminClient.createInternal(KafkaAdminClient.java:525)
	at org.apache.kafka.clients.admin.KafkaAdminClient.createInternal(KafkaAdminClient.java:492)
	at org.apache.kafka.clients.admin.Admin.create(Admin.java:137)
	at org.apache.kafka.tools.TopicCommand$TopicService.createAdminClient(TopicCommand.java:437)
	at org.apache.kafka.tools.TopicCommand$TopicService.<init>(TopicCommand.java:426)
	at org.apache.kafka.tools.TopicCommand.execute(TopicCommand.java:98)
	at org.apache.kafka.tools.TopicCommand.mainNoExit(TopicCommand.java:87)
	at org.apache.kafka.tools.TopicCommand.main(TopicCommand.java:82)
Caused by: java.net.SocketException: Unexpected end of file from server
	at java.base/sun.net.www.http.HttpClient.parseHTTPHeader(HttpClient.java:866)
	at java.base/sun.net.www.http.HttpClient.parseHTTP(HttpClient.java:689)
	at java.base/sun.net.www.http.HttpClient.parseHTTPHeader(HttpClient.java:863)
	at java.base/sun.net.www.http.HttpClient.parseHTTP(HttpClient.java:689)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.getInputStream0(HttpURLConnection.java:1623)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1528)
	at java.base/java.net.HttpURLConnection.getResponseCode(HttpURLConnection.java:527)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.handleOutput(HttpAccessTokenRetriever.java:240)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.post(HttpAccessTokenRetriever.java:194)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.lambda$retrieve$0(HttpAccessTokenRetriever.java:169)
	... 30 more
[2024-10-29 22:17:15,443] WARN Attempt 1 to make call resulted in an error; sleeping 100 ms before retrying (org.apache.kafka.common.security.oauthbearer.internals.secured.Retry)
java.util.concurrent.ExecutionException: java.net.SocketException: Unexpected end of file from server
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.lambda$retrieve$0(HttpAccessTokenRetriever.java:171)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.Retry.execute(Retry.java:70)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.retrieve(HttpAccessTokenRetriever.java:160)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginCallbackHandler.handleTokenCallback(OAuthBearerLoginCallbackHandler.java:243)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginCallbackHandler.handle(OAuthBearerLoginCallbackHandler.java:232)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule.identifyToken(OAuthBearerLoginModule.java:316)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule.login(OAuthBearerLoginModule.java:301)
	at java.base/javax.security.auth.login.LoginContext.invoke(LoginContext.java:726)
	at java.base/javax.security.auth.login.LoginContext$4.run(LoginContext.java:665)
	at java.base/javax.security.auth.login.LoginContext$4.run(LoginContext.java:663)
	at java.base/java.security.AccessController.doPrivileged(AccessController.java:691)
	at java.base/javax.security.auth.login.LoginContext.invokePriv(LoginContext.java:663)
	at java.base/javax.security.auth.login.LoginContext.login(LoginContext.java:574)
	at org.apache.kafka.common.security.oauthbearer.internals.expiring.ExpiringCredentialRefreshingLogin.login(ExpiringCredentialRefreshingLogin.java:204)
	at org.apache.kafka.common.security.oauthbearer.internals.OAuthBearerRefreshingLogin.login(OAuthBearerRefreshingLogin.java:150)
	at org.apache.kafka.common.security.authenticator.LoginManager.<init>(LoginManager.java:62)
	at org.apache.kafka.common.security.authenticator.LoginManager.acquireLoginManager(LoginManager.java:105)
	at org.apache.kafka.common.network.SaslChannelBuilder.configure(SaslChannelBuilder.java:170)
	at org.apache.kafka.common.network.ChannelBuilders.create(ChannelBuilders.java:192)
	at org.apache.kafka.common.network.ChannelBuilders.clientChannelBuilder(ChannelBuilders.java:81)
	at org.apache.kafka.clients.ClientUtils.createChannelBuilder(ClientUtils.java:119)
	at org.apache.kafka.clients.ClientUtils.createNetworkClient(ClientUtils.java:223)
	at org.apache.kafka.clients.ClientUtils.createNetworkClient(ClientUtils.java:189)
	at org.apache.kafka.clients.admin.KafkaAdminClient.createInternal(KafkaAdminClient.java:525)
	at org.apache.kafka.clients.admin.KafkaAdminClient.createInternal(KafkaAdminClient.java:492)
	at org.apache.kafka.clients.admin.Admin.create(Admin.java:137)
	at org.apache.kafka.tools.TopicCommand$TopicService.createAdminClient(TopicCommand.java:437)
	at org.apache.kafka.tools.TopicCommand$TopicService.<init>(TopicCommand.java:426)
	at org.apache.kafka.tools.TopicCommand.execute(TopicCommand.java:98)
	at org.apache.kafka.tools.TopicCommand.mainNoExit(TopicCommand.java:87)
	at org.apache.kafka.tools.TopicCommand.main(TopicCommand.java:82)
Caused by: java.net.SocketException: Unexpected end of file from server
	at java.base/sun.net.www.http.HttpClient.parseHTTPHeader(HttpClient.java:866)
	at java.base/sun.net.www.http.HttpClient.parseHTTP(HttpClient.java:689)
	at java.base/sun.net.www.http.HttpClient.parseHTTPHeader(HttpClient.java:863)
	at java.base/sun.net.www.http.HttpClient.parseHTTP(HttpClient.java:689)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.getInputStream0(HttpURLConnection.java:1623)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1528)
	at java.base/java.net.HttpURLConnection.getResponseCode(HttpURLConnection.java:527)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.handleOutput(HttpAccessTokenRetriever.java:240)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.post(HttpAccessTokenRetriever.java:194)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.lambda$retrieve$0(HttpAccessTokenRetriever.java:169)
	... 30 more
[2024-10-29 22:17:15,555] WARN Error during retry attempt 2 (org.apache.kafka.common.security.oauthbearer.internals.secured.Retry)
java.util.concurrent.ExecutionException: java.net.SocketException: Unexpected end of file from server
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.lambda$retrieve$0(HttpAccessTokenRetriever.java:171)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.Retry.execute(Retry.java:70)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.retrieve(HttpAccessTokenRetriever.java:160)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginCallbackHandler.handleTokenCallback(OAuthBearerLoginCallbackHandler.java:243)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginCallbackHandler.handle(OAuthBearerLoginCallbackHandler.java:232)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule.identifyToken(OAuthBearerLoginModule.java:316)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule.login(OAuthBearerLoginModule.java:301)
	at java.base/javax.security.auth.login.LoginContext.invoke(LoginContext.java:726)
	at java.base/javax.security.auth.login.LoginContext$4.run(LoginContext.java:665)
	at java.base/javax.security.auth.login.LoginContext$4.run(LoginContext.java:663)
	at java.base/java.security.AccessController.doPrivileged(AccessController.java:691)
	at java.base/javax.security.auth.login.LoginContext.invokePriv(LoginContext.java:663)
	at java.base/javax.security.auth.login.LoginContext.login(LoginContext.java:574)
	at org.apache.kafka.common.security.oauthbearer.internals.expiring.ExpiringCredentialRefreshingLogin.login(ExpiringCredentialRefreshingLogin.java:204)
	at org.apache.kafka.common.security.oauthbearer.internals.OAuthBearerRefreshingLogin.login(OAuthBearerRefreshingLogin.java:150)
	at org.apache.kafka.common.security.authenticator.LoginManager.<init>(LoginManager.java:62)
	at org.apache.kafka.common.security.authenticator.LoginManager.acquireLoginManager(LoginManager.java:105)
	at org.apache.kafka.common.network.SaslChannelBuilder.configure(SaslChannelBuilder.java:170)
	at org.apache.kafka.common.network.ChannelBuilders.create(ChannelBuilders.java:192)
	at org.apache.kafka.common.network.ChannelBuilders.clientChannelBuilder(ChannelBuilders.java:81)
	at org.apache.kafka.clients.ClientUtils.createChannelBuilder(ClientUtils.java:119)
	at org.apache.kafka.clients.ClientUtils.createNetworkClient(ClientUtils.java:223)
	at org.apache.kafka.clients.ClientUtils.createNetworkClient(ClientUtils.java:189)
	at org.apache.kafka.clients.admin.KafkaAdminClient.createInternal(KafkaAdminClient.java:525)
	at org.apache.kafka.clients.admin.KafkaAdminClient.createInternal(KafkaAdminClient.java:492)
	at org.apache.kafka.clients.admin.Admin.create(Admin.java:137)
	at org.apache.kafka.tools.TopicCommand$TopicService.createAdminClient(TopicCommand.java:437)
	at org.apache.kafka.tools.TopicCommand$TopicService.<init>(TopicCommand.java:426)
	at org.apache.kafka.tools.TopicCommand.execute(TopicCommand.java:98)
	at org.apache.kafka.tools.TopicCommand.mainNoExit(TopicCommand.java:87)
	at org.apache.kafka.tools.TopicCommand.main(TopicCommand.java:82)
Caused by: java.net.SocketException: Unexpected end of file from server
	at java.base/sun.net.www.http.HttpClient.parseHTTPHeader(HttpClient.java:866)
	at java.base/sun.net.www.http.HttpClient.parseHTTP(HttpClient.java:689)
	at java.base/sun.net.www.http.HttpClient.parseHTTPHeader(HttpClient.java:863)
	at java.base/sun.net.www.http.HttpClient.parseHTTP(HttpClient.java:689)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.getInputStream0(HttpURLConnection.java:1623)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1528)
	at java.base/java.net.HttpURLConnection.getResponseCode(HttpURLConnection.java:527)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.handleOutput(HttpAccessTokenRetriever.java:240)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.post(HttpAccessTokenRetriever.java:194)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.lambda$retrieve$0(HttpAccessTokenRetriever.java:169)
	... 30 more
[2024-10-29 22:17:15,557] WARN Attempt 2 to make call resulted in an error; sleeping 200 ms before retrying (org.apache.kafka.common.security.oauthbearer.internals.secured.Retry)
java.util.concurrent.ExecutionException: java.net.SocketException: Unexpected end of file from server
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.lambda$retrieve$0(HttpAccessTokenRetriever.java:171)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.Retry.execute(Retry.java:70)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.retrieve(HttpAccessTokenRetriever.java:160)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginCallbackHandler.handleTokenCallback(OAuthBearerLoginCallbackHandler.java:243)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginCallbackHandler.handle(OAuthBearerLoginCallbackHandler.java:232)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule.identifyToken(OAuthBearerLoginModule.java:316)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule.login(OAuthBearerLoginModule.java:301)
	at java.base/javax.security.auth.login.LoginContext.invoke(LoginContext.java:726)
	at java.base/javax.security.auth.login.LoginContext$4.run(LoginContext.java:665)
	at java.base/javax.security.auth.login.LoginContext$4.run(LoginContext.java:663)
	at java.base/java.security.AccessController.doPrivileged(AccessController.java:691)
	at java.base/javax.security.auth.login.LoginContext.invokePriv(LoginContext.java:663)
	at java.base/javax.security.auth.login.LoginContext.login(LoginContext.java:574)
	at org.apache.kafka.common.security.oauthbearer.internals.expiring.ExpiringCredentialRefreshingLogin.login(ExpiringCredentialRefreshingLogin.java:204)
	at org.apache.kafka.common.security.oauthbearer.internals.OAuthBearerRefreshingLogin.login(OAuthBearerRefreshingLogin.java:150)
	at org.apache.kafka.common.security.authenticator.LoginManager.<init>(LoginManager.java:62)
	at org.apache.kafka.common.security.authenticator.LoginManager.acquireLoginManager(LoginManager.java:105)
	at org.apache.kafka.common.network.SaslChannelBuilder.configure(SaslChannelBuilder.java:170)
	at org.apache.kafka.common.network.ChannelBuilders.create(ChannelBuilders.java:192)
	at org.apache.kafka.common.network.ChannelBuilders.clientChannelBuilder(ChannelBuilders.java:81)
	at org.apache.kafka.clients.ClientUtils.createChannelBuilder(ClientUtils.java:119)
	at org.apache.kafka.clients.ClientUtils.createNetworkClient(ClientUtils.java:223)
	at org.apache.kafka.clients.ClientUtils.createNetworkClient(ClientUtils.java:189)
	at org.apache.kafka.clients.admin.KafkaAdminClient.createInternal(KafkaAdminClient.java:525)
	at org.apache.kafka.clients.admin.KafkaAdminClient.createInternal(KafkaAdminClient.java:492)
	at org.apache.kafka.clients.admin.Admin.create(Admin.java:137)
	at org.apache.kafka.tools.TopicCommand$TopicService.createAdminClient(TopicCommand.java:437)
	at org.apache.kafka.tools.TopicCommand$TopicService.<init>(TopicCommand.java:426)
	at org.apache.kafka.tools.TopicCommand.execute(TopicCommand.java:98)
	at org.apache.kafka.tools.TopicCommand.mainNoExit(TopicCommand.java:87)
	at org.apache.kafka.tools.TopicCommand.main(TopicCommand.java:82)
Caused by: java.net.SocketException: Unexpected end of file from server
	at java.base/sun.net.www.http.HttpClient.parseHTTPHeader(HttpClient.java:866)
	at java.base/sun.net.www.http.HttpClient.parseHTTP(HttpClient.java:689)
	at java.base/sun.net.www.http.HttpClient.parseHTTPHeader(HttpClient.java:863)
	at java.base/sun.net.www.http.HttpClient.parseHTTP(HttpClient.java:689)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.getInputStream0(HttpURLConnection.java:1623)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1528)
	at java.base/java.net.HttpURLConnection.getResponseCode(HttpURLConnection.java:527)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.handleOutput(HttpAccessTokenRetriever.java:240)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.post(HttpAccessTokenRetriever.java:194)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.lambda$retrieve$0(HttpAccessTokenRetriever.java:169)
	... 30 more
[2024-10-29 22:17:15,785] WARN Error during retry attempt 3 (org.apache.kafka.common.security.oauthbearer.internals.secured.Retry)
java.util.concurrent.ExecutionException: java.net.SocketException: Unexpected end of file from server
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.lambda$retrieve$0(HttpAccessTokenRetriever.java:171)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.Retry.execute(Retry.java:70)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.retrieve(HttpAccessTokenRetriever.java:160)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginCallbackHandler.handleTokenCallback(OAuthBearerLoginCallbackHandler.java:243)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginCallbackHandler.handle(OAuthBearerLoginCallbackHandler.java:232)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule.identifyToken(OAuthBearerLoginModule.java:316)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule.login(OAuthBearerLoginModule.java:301)
	at java.base/javax.security.auth.login.LoginContext.invoke(LoginContext.java:726)
	at java.base/javax.security.auth.login.LoginContext$4.run(LoginContext.java:665)
	at java.base/javax.security.auth.login.LoginContext$4.run(LoginContext.java:663)
	at java.base/java.security.AccessController.doPrivileged(AccessController.java:691)
	at java.base/javax.security.auth.login.LoginContext.invokePriv(LoginContext.java:663)
	at java.base/javax.security.auth.login.LoginContext.login(LoginContext.java:574)
	at org.apache.kafka.common.security.oauthbearer.internals.expiring.ExpiringCredentialRefreshingLogin.login(ExpiringCredentialRefreshingLogin.java:204)
	at org.apache.kafka.common.security.oauthbearer.internals.OAuthBearerRefreshingLogin.login(OAuthBearerRefreshingLogin.java:150)
	at org.apache.kafka.common.security.authenticator.LoginManager.<init>(LoginManager.java:62)
	at org.apache.kafka.common.security.authenticator.LoginManager.acquireLoginManager(LoginManager.java:105)
	at org.apache.kafka.common.network.SaslChannelBuilder.configure(SaslChannelBuilder.java:170)
	at org.apache.kafka.common.network.ChannelBuilders.create(ChannelBuilders.java:192)
	at org.apache.kafka.common.network.ChannelBuilders.clientChannelBuilder(ChannelBuilders.java:81)
	at org.apache.kafka.clients.ClientUtils.createChannelBuilder(ClientUtils.java:119)
	at org.apache.kafka.clients.ClientUtils.createNetworkClient(ClientUtils.java:223)
	at org.apache.kafka.clients.ClientUtils.createNetworkClient(ClientUtils.java:189)
	at org.apache.kafka.clients.admin.KafkaAdminClient.createInternal(KafkaAdminClient.java:525)
	at org.apache.kafka.clients.admin.KafkaAdminClient.createInternal(KafkaAdminClient.java:492)
	at org.apache.kafka.clients.admin.Admin.create(Admin.java:137)
	at org.apache.kafka.tools.TopicCommand$TopicService.createAdminClient(TopicCommand.java:437)
	at org.apache.kafka.tools.TopicCommand$TopicService.<init>(TopicCommand.java:426)
	at org.apache.kafka.tools.TopicCommand.execute(TopicCommand.java:98)
	at org.apache.kafka.tools.TopicCommand.mainNoExit(TopicCommand.java:87)
	at org.apache.kafka.tools.TopicCommand.main(TopicCommand.java:82)
Caused by: java.net.SocketException: Unexpected end of file from server
	at java.base/sun.net.www.http.HttpClient.parseHTTPHeader(HttpClient.java:866)
	at java.base/sun.net.www.http.HttpClient.parseHTTP(HttpClient.java:689)
	at java.base/sun.net.www.http.HttpClient.parseHTTPHeader(HttpClient.java:863)
	at java.base/sun.net.www.http.HttpClient.parseHTTP(HttpClient.java:689)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.getInputStream0(HttpURLConnection.java:1623)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1528)
	at java.base/java.net.HttpURLConnection.getResponseCode(HttpURLConnection.java:527)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.handleOutput(HttpAccessTokenRetriever.java:240)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.post(HttpAccessTokenRetriever.java:194)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.lambda$retrieve$0(HttpAccessTokenRetriever.java:169)
	... 30 more
[2024-10-29 22:17:15,788] WARN Attempt 3 to make call resulted in an error; sleeping 400 ms before retrying (org.apache.kafka.common.security.oauthbearer.internals.secured.Retry)
java.util.concurrent.ExecutionException: java.net.SocketException: Unexpected end of file from server
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.lambda$retrieve$0(HttpAccessTokenRetriever.java:171)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.Retry.execute(Retry.java:70)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.retrieve(HttpAccessTokenRetriever.java:160)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginCallbackHandler.handleTokenCallback(OAuthBearerLoginCallbackHandler.java:243)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginCallbackHandler.handle(OAuthBearerLoginCallbackHandler.java:232)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule.identifyToken(OAuthBearerLoginModule.java:316)
	at org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule.login(OAuthBearerLoginModule.java:301)
	at java.base/javax.security.auth.login.LoginContext.invoke(LoginContext.java:726)
	at java.base/javax.security.auth.login.LoginContext$4.run(LoginContext.java:665)
	at java.base/javax.security.auth.login.LoginContext$4.run(LoginContext.java:663)
	at java.base/java.security.AccessController.doPrivileged(AccessController.java:691)
	at java.base/javax.security.auth.login.LoginContext.invokePriv(LoginContext.java:663)
	at java.base/javax.security.auth.login.LoginContext.login(LoginContext.java:574)
	at org.apache.kafka.common.security.oauthbearer.internals.expiring.ExpiringCredentialRefreshingLogin.login(ExpiringCredentialRefreshingLogin.java:204)
	at org.apache.kafka.common.security.oauthbearer.internals.OAuthBearerRefreshingLogin.login(OAuthBearerRefreshingLogin.java:150)
	at org.apache.kafka.common.security.authenticator.LoginManager.<init>(LoginManager.java:62)
	at org.apache.kafka.common.security.authenticator.LoginManager.acquireLoginManager(LoginManager.java:105)
	at org.apache.kafka.common.network.SaslChannelBuilder.configure(SaslChannelBuilder.java:170)
	at org.apache.kafka.common.network.ChannelBuilders.create(ChannelBuilders.java:192)
	at org.apache.kafka.common.network.ChannelBuilders.clientChannelBuilder(ChannelBuilders.java:81)
	at org.apache.kafka.clients.ClientUtils.createChannelBuilder(ClientUtils.java:119)
	at org.apache.kafka.clients.ClientUtils.createNetworkClient(ClientUtils.java:223)
	at org.apache.kafka.clients.ClientUtils.createNetworkClient(ClientUtils.java:189)
	at org.apache.kafka.clients.admin.KafkaAdminClient.createInternal(KafkaAdminClient.java:525)
	at org.apache.kafka.clients.admin.KafkaAdminClient.createInternal(KafkaAdminClient.java:492)
	at org.apache.kafka.clients.admin.Admin.create(Admin.java:137)
	at org.apache.kafka.tools.TopicCommand$TopicService.createAdminClient(TopicCommand.java:437)
	at org.apache.kafka.tools.TopicCommand$TopicService.<init>(TopicCommand.java:426)
	at org.apache.kafka.tools.TopicCommand.execute(TopicCommand.java:98)
	at org.apache.kafka.tools.TopicCommand.mainNoExit(TopicCommand.java:87)
	at org.apache.kafka.tools.TopicCommand.main(TopicCommand.java:82)
Caused by: java.net.SocketException: Unexpected end of file from server
	at java.base/sun.net.www.http.HttpClient.parseHTTPHeader(HttpClient.java:866)
	at java.base/sun.net.www.http.HttpClient.parseHTTP(HttpClient.java:689)
	at java.base/sun.net.www.http.HttpClient.parseHTTPHeader(HttpClient.java:863)
	at java.base/sun.net.www.http.HttpClient.parseHTTP(HttpClient.java:689)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.getInputStream0(HttpURLConnection.java:1623)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1528)
	at java.base/java.net.HttpURLConnection.getResponseCode(HttpURLConnection.java:527)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.handleOutput(HttpAccessTokenRetriever.java:240)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.post(HttpAccessTokenRetriever.java:194)
	at org.apache.kafka.common.security.oauthbearer.internals.secured.HttpAccessTokenRetriever.lambda$retrieve$0(HttpAccessTokenRetriever.java:169)
	... 30 more
[2024-10-29 22:17:16,926] WARN [Principal=:f3e0ecec-42d0-455e-88aa-5db45560c160]: Expiring credential expires at Tue Oct 29 22:18:16 GMT 2024, so buffer times of 60 and 300 seconds at the front and back, respectively, cannot be accommodated.  We will refresh at Tue Oct 29 22:18:06 GMT 2024. (org.apache.kafka.common.security.oauthbearer.internals.expiring.ExpiringCredentialRefreshingLogin)
Created topic cars.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Jmhq6hTNP4v7T955ucghO63Yy.svg)](https://asciinema.org/a/Jmhq6hTNP4v7T955ucghO63Yy)

</TabItem>
</Tabs>

## Listing topics in gateway1








<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config user-1.properties \
    --list
```


</TabItem>
<TabItem value="Output">

```
[2024-10-29 22:17:19,880] WARN [Principal=:f3e0ecec-42d0-455e-88aa-5db45560c160]: Expiring credential expires at Tue Oct 29 22:18:19 GMT 2024, so buffer times of 60 and 300 seconds at the front and back, respectively, cannot be accommodated.  We will refresh at Tue Oct 29 22:18:09 GMT 2024. (org.apache.kafka.common.security.oauthbearer.internals.expiring.ExpiringCredentialRefreshingLogin)
cars

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/bq4SZUzmUS5ic2auuPA2YnWFS.svg)](https://asciinema.org/a/bq4SZUzmUS5ic2auuPA2YnWFS)

</TabItem>
</Tabs>

## Tearing down the docker environment

Remove all your docker processes and associated volumes

* `--volumes`: Remove named volumes declared in the "volumes" section of the Compose file and anonymous volumes attached to containers.






<Tabs>

<TabItem value="Command">
```sh
docker compose down --volumes
```


</TabItem>
<TabItem value="Output">

```
 Container gateway2  Stopping
 Container gateway1  Stopping
 Container kafka-client  Stopping
 Container keycloak  Stopping
 Container schema-registry  Stopping
 Container gateway1  Stopped
 Container gateway1  Removing
 Container keycloak  Stopped
 Container keycloak  Removing
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway1  Removed
 Container gateway2  Removed
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container schema-registry  Removed
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container keycloak  Removed
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Container kafka3  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Network oauth_default  Removing
 Network oauth_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/FUtA35ojpIBLEQUkd2PvkHmzC.svg)](https://asciinema.org/a/FUtA35ojpIBLEQUkd2PvkHmzC)

</TabItem>
</Tabs>

# Conclusion

OAuth is your next security protocol!

