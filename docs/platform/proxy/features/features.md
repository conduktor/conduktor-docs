# Conduktor Proxy Features

Conduktor Proxy enables a set of features above and beyond what is available from the underlying Kafka cluster it operates on.

## Multi Tenancy

The multi tenancy feature of Conduktor Proxy allows a single underlying Kafka cluster to be represented as many, isolated smaller clusters to clients. These representations can duplicate topic/consumer group names etc. and remain isolated from eachother. 

To give an example, an organisation may host applications for point of sale and procurement. Both of these may require a topic named "orders" but may not be aware of the requirement of the other application. Multi Tenancy addresses this issue by allowing the two applications to go exist in an isolated manner on the backing cluster.

For more detail regarding this see the **[multi tenancy demo](https://github.com/conduktor/conduktor-proxy-demos/tree/main/multi-tenant)**

## Encryption

Conduktor Proxy can transparently encrypt and decrypt data as it is written or read from Kafka. This requires no changes to clients that access the proxy but retains the information in Kafka in a format that is unreadable by illegitimate clients.

Encryption can be applied to entire messages or sensitive fields within them and, with integration with Schema Registry supports a wide variety of message types.

For more detail regarding this see the **[encryption demo](https://github.com/conduktor/conduktor-proxy-demos/tree/main/encryption)**

## Chaos Proxy

Kafka is often prized for its resilience but the applications that operate on it often go untested and unprepared for issues that can affect Kafka clients. 

Chaos proxy addresses this by simulating common issues, such as latency and request failures to the clients that connect to Kafka through it. Scenarios in which these errors are created can be curated to provide complete coverage and ensure that, should the worst happen, your applications will endure. 

## Safeguard

One of the main advantages of Kafka is its flexibility. However, with this flexibility, comes a risk of misconfiguration that can result in inefficient or even potentially dangerous client configurations. Such configurations can easily go undetected and impact application performance.

Conduktor Proxy Safeguard detects inefficient or incorrect configurations of this type and either transparently corrects them or reports them to the applications so that they can be remedied. The result is a more efficient, higher performing system.