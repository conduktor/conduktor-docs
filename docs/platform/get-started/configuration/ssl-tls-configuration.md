---
sidebar_position: 9
title: SSL/TLS Configuration
description: Depending on the environment, Conduktor might need to access external services like Kafka clusters, SSO servers, database, or object-storage that require custom certificate for SSL/TLS communication.
---

# SSL/TLS configuration

Depending on the environment, Conduktor might need to access external services like Kafka clusters, SSO servers, database, or object storage that require a custom certificate for SSL/TLS communication.

The following table gives you an overview of what's currently supported and the methods to configure it:

- **From the UI (recommended)**: From Conduktor Console, you can manage your certificates on a dedicated screen. You can also configure SSL authentication from the broker setup wizard.
- **Volume mount**: This method is only required if you have LDAPS. Do not use it for Kafka or Kafka components.

|                                | Kafka Clusters | Schema Registry / Kafka Connect | LDAPS, OIDC     |
| ------------------------------ | -------------- | ------------------------------- | --------------- |
| SSL to secure data in transit  | ✅ UI          | ✅ UI                           | ✅ UI            |
| SSL to authenticate the client | ✅ UI          | ✅ UI                           | 🚫 Not supported |

Jump to:

- [Using the Conduktor Certificate Store](#using-the-conduktor-certificate-store)
  - _Recommended for Kafka, Kafka Connect and Schema Registry connections_
- [Mounting Custom Truststore](#mounting-custom-truststore)
  - _Recommended for SSO, DB or other external services requiring SSL/TLS communication_
- [Client Certificate Authentication](#client-certificate-authentication)
  - _Recommended for mTLS; import your keystore file_

## Using the Conduktor Certificate Store

You can manage custom certificates for Kafka, Kafka Connect and Schema Registry through the Console UI. This enables you to import and parse the certificates as text or files. The supported file formats are:

- `.crt`
- `.pem`
- `.jks`
- `.p12`

### Uploading certificates in the cluster configuration screen

Assuming you have appropriate permissions, you can add cluster configurations from within **Admin**. When you add the bootstrap server to your configuration, a check will be made to validate if the certificate is issued by a valid authority.

![](assets/cluster-ssl.png)

If the response indicates the certificate is not issued by a valid authority, you have two options:

- **Skip SSL Check**: This will skip validation of the SSL certificate on your server. This is an easy option for development environments with self-signed certificates
- **Upload Certificate**: This option will enable you to upload the certificate (`.crt`, `.pem`, `.jks` or `.p12` files), or paste the certificate as text

import ClusterCertificate from './assets/cluster-certificate.png';

<img src={ClusterCertificate} alt="Cluster Certificate" style={{ width: 500, display: 'block', margin: 'auto' }} />

Upon uploading the certificate, you should then see the green icon indicating the **connection is secure**.

![](assets/cluster-connection-secure.png)

### Adding truststores in the dedicated certificates screen

Provided you have permissions, you can also manage organization truststores via the **Certificates** tab within **Settings**.

Simply add all of your certificates by uploading them or pasting them as text. In doing this, the SSL context will be derived when you configure Kafka, Kafka Connect and Schema Registry connections.

![](assets/certificates.png)

## Mounting Custom Truststore

Conduktor supports SSL/TLS connections using Java Truststore. The below details how to mount a custom truststore when starting Conduktor.

### Create TrustStore (JKS) from certificate in PEM format

If you already have a truststore, you can ignore this step.

For that, you need a `keytool` program that is usually packaged on JDK distributions and a certificate in PEM format (`.pem` or `.crt`).

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

### Configure custom truststore on Conduktor Console

For that we need to mount the truststore file into the conduktor-console container and pass the correct environment variables
for locating truststore file inside the container and password if needed.

Assuming that truststore file is named `truststore.jks` with password `changeit`.  
We mount truststore file into `/opt/conduktor/certs/truststore.jks` inside the container.

If run from docker :

```bash
 docker run --rm \
   --mount "type=bind,source=$PWD/truststore.jks,target=/opt/conduktor/certs/truststore.jks" \
   -e CDK_SSL_TRUSTSTORE_PATH="/opt/conduktor/certs/truststore.jks" \
   -e CDK_SSL_TRUSTSTORE_PASSWORD="changeit" \
  conduktor/conduktor-console
```

From docker-compose :

```yaml
services:
  conduktor-console:
    image: conduktor/conduktor-console
    ports:
      - 8080:8080
    volumes:
      - type: bind
        source: ./truststore.jks
        target: /opt/conduktor/certs/truststore.jks
        read_only: true
    environment:
      CDK_SSL_TRUSTSTORE_PATH: '/opt/conduktor/certs/truststore.jks'
      CDK_SSL_TRUSTSTORE_PASSWORD: 'changeit'
```

## Client Certificate Authentication

This mechanism uses TLS protocol to authenticate the client.
Other names include:

- Mutual SSL, Mutual TLS, mTLS
- Two-Way SSL, SSL Certificate Authentication
- Digital Certificate Authentication, Public Key Infrastructure (PKI) Authentication

### Using the UI (keystore method)
Your Kafka Admin or your Kafka Provider gave you a keystore file (`.jks` or `.p12` format).

Click the "Import from keystore" button to select a keystore file from your filesystem.
![](assets/cluster-keystore.png)

Fill in the required keystore password and key password and click "Import".

import ImportFromKeystore from './assets/import-from-keystore.png';

<img src={ImportFromKeystore} alt="Import from keystore" style={{ width: 500, display: 'block', margin: 'auto' }} />

You'll get back to the cluster screen with the content of your keystore extracted into Access key and Access certificate.
![](assets/cluster-keystore-imported.png)

### Using the UI (Access key & Access certificate method)

Your Kafka Admin or your Kafka Provider gave you 2 files for authentication.

- An Access key (`.key` file)
- An Access certificate (`.pem` or `.crt` file)

Here's an example with Aiven:
![](assets/aiven-certificates.png)

You can paste the 2 file's contents into Conduktor, or alternatively import from keystore [as detailed in the previous section](#using-the-ui-keystore-method).

### Using Volume Mount (Alternate method)

You can mount the keystore file in 'conduktor-console' image:

```yaml
services:
  conduktor-console:
    image: conduktor/conduktor-console
    ports:
      - 8080:8080
    volumes:
      - type: bind
        source: ./keystore.jks
        target: /opt/conduktor/certs/keystore.jks
        read_only: true
```

Then from the UI, choose the SSL Authentication method "Keystore file is mounted on the volume" and fill in the required fields
![](assets/keystore-from-volume.png)
