---
sidebar_position: 5
---

# SSL/TLS configuration

Depending on the environment, conduktor-platform might need to access external services like Kafka clusters, SSO servers, database, object-storage, ... that require custom certificate for SSL/TLS communication.

Since version 1.5.0 Conduktor-platform support SSL/TLS connections using Java Truststore. 


### Create TrustStore (jks) from certificat in PEM format
If you already have a truststore, you can ignore this step. 

For that ou need `keytool` program that is usually package on JDK distributions and a certificat in PEM format (`.pem` or `.crt`).

```bash
keytool  \
    -importcert \
    -noprompt \
    -trustcacerts \
    -keystore ./truststore.jks \       # Output truststore jks file
    -alias "my-domain.com" \           # Certificate alias inside the truststore (usually the certificate subject)
    -file ./my-certificate-file.pem \  # Input certificate file
    -storepass changeit \              # Truststore password
    -storetype JKS
```

### Configure custom truststore on conduktor-plaform

For that we need to mount the truststore file into the conduktor-platform container and pass the correct environment variables 
for locating truststore file inside the container and password if needed. 

Assuming that truststore file is named `truststore.jks` with password `changeit`.  
We mount truststore file into `/opt/conduktor/certs/truststore.jks` inside the container.

If run from docker :
```bash
 docker run --rm \
   --mount "type=bind,source=$PWD/truststore.jks,target=/opt/conduktor/certs/truststore.jks" \
   -e EMBEDDED_POSTGRES="false" \
   -e CDK_SSL_TRUSTSTORE_PATH="/opt/conduktor/certs/truststore.jks" \
   -e CDK_SSL_TRUSTSTORE_PASSWORD="changeit" \
  conduktor/conduktor-platform:latest
```

From docker-compose :
```yaml
version: '3.8'

services:
  conduktor-platform:
    image: conduktor/conduktor-platform:latest
    ports:
      - 8080:8080
    volumes:
      - type: bind
        source: ./truststore.jks
        target: /opt/conduktor/certs/truststore.jks
        read_only: true
    environment:
      CDK_SSL_TRUSTSTORE_PATH: "/opt/conduktor/certs/truststore.jks"
      CDK_SSL_TRUSTSTORE_PASSWORD: "changeit"
```
