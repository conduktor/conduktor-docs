---
version: 3.0.0
title: Encryption - FAQ
description: Encrypt data within your Kafka records to ensure the data cannot be read by third parties.
parent: data-security
license: enterprise
---

export const Highlight = ({children, color, text}) => (
<span style={{ backgroundColor: color, borderRadius: '4px', color: text, padding: '0.2rem 0.5rem', fontWeight: '500', }}>
{children}
</span>
);

export const KMS = () => (
<Highlight color="#F8F1EE" text="#7D5E54">KMS</Highlight>
);

export const KEK = () => (
<Highlight color="#E7F9F5" text="#067A6F">KEK</Highlight>
);

export const EDEK = () => (
<Highlight color="#F0F4FF" text="#3451B2">EDEK</Highlight>
);

export const DEK = () => (
<Highlight color="#FEEFF6" text="#CB1D63">DEK</Highlight>
);

## Table of Contents
- [Introduction](#introduction)
- [How It Works](#how-it-works)
- [FAQ](#faq)

## Introduction

The Encryption interceptor is a robust and versatile solution for securing data within Kafka records. Its primary function is to safeguard sensitive information from unauthorized access, thereby enhancing data security both in transit and at rest.

### Key Features
**Field-Level Encryption**: Encrypts specific fields within Kafka records, such as passwords or Personally Identifiable Information (PII). This feature is ideal for scenarios where only certain parts of a message contain sensitive data.

**Full Message Encryption**: Encrypts the entire Kafka record, ensuring that all contents of the message are secured. This is particularly useful when the entire message is sensitive.

You can find more details about the encryptions types [here](../encryption-configuration/#encryption-types).

## How It Works
Once configured, the encryption and decryption processes are seamlessly managed by the interceptor.

**Encryption**: The interceptor identifies the data that needs to be encrypted & the KMS details to share the encryption key, Gateway will then encrypt and produce the message.

**Decryption**: Similar to encryption, the interceptor can decrypt either the entire message, specific fields or all the fields, based on your configuration.

See [Encryption and Decryption Processes](#encryption-and-decryption-processes) below for more details.

### Flexibility and Compatibility
You can refine how it's encrypted with a choice of algorithm and KMS provider.

**Multiple Encryption Algorithms**: The interceptor supports a variety of encryption algorithms, allowing you to choose the one that best meets your security requirements.

**KMS Integration**: It integrates with various Key Management Services (KMS), providing flexibility in how you manage and store encryption keys.

### Encryption and Decryption Processes
Details on how the encryption takes place step by step. Jump to the [diagram](#key-management) below if you want the simplified steps involving the keys.

#### How Does Gateway Encrypt Data?

1. **Data Identification**: The interceptor first determines, based on its configuration, what data needs to be encrypted. This may include the entire message, specific fields, or all the fields within the message. For example, if you have configured the interceptor to encrypt a `password` field, it will target this field within the incoming Kafka record for encryption.  

2. **Key Retrieval**: The interceptor then generates a key and shares it with the the configured Key Management Service (KMS), or retrieves it if existing. Supported KMS options include Vault, Azure, AWS, GCP, or an in-memory service for local development only. The key is fetched using the `keySecretId` specified in your configuration to ensure the correct key is utilized. You can find more details about the key retrieval [here](#key-management).

3. **Encryption**: Once the key is generated, or retrieved, the interceptor encrypts the identified data using the specified encryption algorithm. The original data within the message is now replaced with the encrypted version.

4. **Transmission**: Finally, the encrypted data is either:
- Stored as is if it is an Avro record
- Converted into a JSON format

And is then transmitted as a string to the designated destination.

#### How Does Gateway Decrypt Data?

1. **Data Identification**: The interceptor first determines, based on its configuration, which data needs to be decrypted. This may include the entire message, specific fields, or all the fields within the message.

2. **Key Retrieval**: The interceptor retrieves the decryption key from the Key Management Service (KMS). Typically, this is the same key that was used during encryption. The correct key is obtained using the `keySecretId` provided in your interceptor configuration, and that is stored in the header of the record, on the backing Kafka. You can find more details about the key retrieval [here](#key-management).

3. **Decryption**: The interceptor then decrypts the identified data using the retrieved key and the specified encryption algorithm. The decrypted data replaces the encrypted data within the message.

4. **Consumption**: Once decrypted, the message is ready for consumption by the end-user or application. The interceptor ensures that the decrypted data is correctly formatted and fully compatible with the Kafka record structure.

Note: The encryption and decryption processes are fully transparent to the end-user or application. The interceptor manages all these operations, allowing you to concentrate on your core business logic.

### Key Management

The interceptor uses the `envelope encryption` technique to encrypt the data. 

Let's define some key terms to better understand the section below:

|  Term   | Definition                                                                                                                                               |
|:-------:|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| <KMS/>  | **Key Management Service**: A system responsible for managing and storing cryptographic keys, including the <KEK/>.                                      |
| <KEK/>  | **Key Encryption Key**: A key stored in the <KMS/>, used to encrypt the <DEK/>. Notably, the <KEK/> is never exposed to or known by the interceptor.     |
| <DEK/>  | **Data Encryption Key**: A key generated by the interceptor, used to encrypt the actual data.                                                            |
| <EDEK/> | **Encrypted Data Encryption Key**: The <DEK/> that has been encrypted by the <KEK/>, ensuring that the <DEK/> remains secure when stored or transmitted. |

To **encrypt** the data, the Gateway:
1. Generates a <DEK/> that is used to encrypt the data
2. Sends the <DEK/> to the <KMS/>, so it encrypts it using its <KEK/> and returns the <EDEK/> to the Gateway
3. Cache the <DEK/> & <EDEK/> in memory for a [configurable Time to Live (TTL)](#optimizing-performance-with-caching)
4. Encrypts the data using the <DEK/>
5. Stores the <EDEK/> alongside the encrypted data, and both are sent to the backing Kafka

To **decrypt** the data, the Gateway:
1. Retrieves the <EDEK/> that's stored with the encrypted data
2. Sends the <EDEK/> to the <KMS/>, which decrypts it (using the <KEK/>) and returns the <DEK/> to Gateway
3. Decrypts the data using the <DEK/>

![envelope encryption](../../../medias/encryption.png)

### Optimizing Performance with Caching
To reduce the number of calls to the <KMS/> and avoid some of the steps detailed above, the interceptor caches the <DEK/> in memory. The cache has a configurable Time to Live (TTL), and the interceptor will call the <KMS/> to decrypt the <EDEK/> if the <DEK/> is not in the cache, as detailed in the steps 1 and 2 above.

## FAQ

### How does encryption work with Avro, JSON Schema, and Protocol Buffers records?

:::tip[**TL;DR**]
- **Gateway >= 3.3.0 and Avro format**: The record is stored in Avro in the backing Kafka, and the encrypted non-string fields are stored in the headers of the record.
- **Gateway < 3.3.0 or Protobuf / JSON schema**: the record is stored in JSON in the backing Kafka and will not be compatible with the schema if the encrypted fields are not strings.
:::

#### From 3.3.0 (Avro only)

This is **for Avro only** field-level encryption, for formats like Protobuf and JSON Schema, the below has no effect.

Gateway runs with `schemaDataMode` set to `preserve_avro` , to preserve the original record type. The plugin maintains the Avro format of the record rather than converting it to JSON, as was the previous behavior.

When the field type isn't a string, the interceptor will set it to the minimum value of its type (`-2147483648` for integers, `1.4e-45` for floats, etc.). Its encrypted value will be a string stored in the headers of the record.

If you want to fall back to legacy behavior of converting to JSON, you can explicitly set `"schemaDataMode": "convert_json"`.

#### Before 3.3.0 (and later for Protobuf and JSON Schema)

In legacy versions of Gateway we store all encrypted data in a JSON format in the backing Kafka, and we get it back to its original format during decryption.
If a field cannot be decrypted due to a lack of permissions, it is replaced with a default value to maintain schema compatibility.

**Example:** Consider the case of a salary field:

Original value: `2000` (integer)

Encrypted value: `XQS213KKDK2Q` (string)

When decrypting: 
- If decryption is successful and the user has the necessary permissions, the salary is restored to its original numeric value.
- If decryption fails due to insufficient permissions, the salary is set to a default value (e.g., 0) instead of the encrypted string.

This had it's issues which is why we changed the design to the above:

- As the data pushed to Gateway are in Avro format (for instance), and the consumers expect Avro too, then the data **must** be decrypted to get back to its expected format.
- The Decryption plugin cannot be applied without decrypting a field. This means that your consumers are not able to consume data in its original format without decrypting at least one field.
- Even if the field encrypted is a string, we still store it as a JSON, even though it is not necessary.

### Does the interceptor support key rotation?

Yes, from the KMS. Key rotation is a crucial aspect of cryptographic key management, typically handled at the KMS level. While the interceptor does not directly manage key rotation, it transitions to using new keys for encryption and decryption when a key is rotated within the KMS, ensuring continued security without manual intervention.

However, if the KEK in the KMS is rotated, the interceptor might continue using an older DEK version if it is still [cached](#optimizing-performance-with-caching). To ensure the interceptor uses the latest KEK version, you can configure a shorter Time to Live (TTL) for the cache. Be aware that this may result in more frequent KMS calls, which could impact performance.

### Is the KMS called on a per-message basis?

The interceptor's interaction with the KMS depends on its configuration:

- **With Key Caching Enabled**: If the interceptor is configured to [cache keys](#optimizing-performance-with-caching), it will only query the KMS when a key is not found in the cache. This reduces the frequency of KMS calls and can improve performance.

- **Without Key Caching**: If key caching is not enabled, the interceptor will query the KMS on a per-message basis, ensuring that it always uses the most current key.

For more information, refer to the [Key Management](#key-management) section.

### What happens if the interceptor is unable to encrypt the message?

If the interceptor fails to encrypt a message, it will generate an error (1) for the client, (2) in the Gateway container logs, and (3) in the Gateway audit log topic, preventing the message from being sent to its destination. This safeguard ensures that sensitive data is always securely encrypted before sending to backing Kafka.

### What happens if the interceptor is unable to decrypt the message?

If the interceptor is unable to decrypt a message, the encrypted message will be returned to the client. This ensures that sensitive data remains protected and is not exposed to unauthorized third parties.

### When does the Gateway call the KMS? Do we store the keys in the interceptor?

The interceptor caches keys in memory, with a configurable time-to-live (TTL) for the [cache](#optimizing-performance-with-caching). If a key is not found in the cache, the interceptor will call the KMS to decrypt and retrieve the key. For further details, refer to the [Key Management](#key-management) section.

### Can I use encrypted data as the `keySecretId`?

No, you cannot use encrypted data as the `keySecretId`, because the value of a field will be replaced with its encrypted value.

### What is the difference between the Encryption on Produce and the Encryption on Consume interceptors?

**Encryption on Produce Interceptor**: This interceptor encrypts data before it is sent to the destination. It ensures that sensitive information is securely encrypted before it leaves your infrastructure and it's sent to the backing Kafka.

**Encryption on Consume Interceptor**: This interceptor decrypts data before it is accessed by the end-user or application. The raw data is stored in the backing Kafka, but it will be encrypted before it is consumed by end-users or applications.

You can find more details in the [Encryption Types](../encryption-configuration#encryption-types) section.
