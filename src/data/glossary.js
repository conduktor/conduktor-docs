const glossaryTerms = [
    {
        term: "Apache Flink",
        definition: "A distributed stream processing framework that enables stateful computations on real-time and batch data at scale.",
        slug: "apache-flink"
    },
    {
      term: "Apache Kafka",
      definition: "An open-source distributed event streaming platform used for real-time data pipelines and event-driven applications.",
      slug: "apache-kafka"
    },
    {
      term: "Broker",
      definition: "A Kafka server that stores and manages incoming and outgoing data messages.",
      slug: "broker"
    },
    {
      term: "Kafka",
      definition: "Apache Kafka is an open-source distributed event streaming platform used for real-time data pipelines and event-driven applications.",
      slug: "kafka"
    },
    {
        term: "Artifact",
        definition: "Artifacts are the underlying components that power Conduktor products such as [Exchange](#exchange). These components are packaged as Docker images. Artifacts are what you deploy in your infrastructure and connect to [Kafka](#kafka) or other systems to get business value. There are three artifacts: `conduktor-console`, `conduktor-console-cortex` and `conduktor-gateway`.",
        slug: "artifact"
    },
    {
        term: "CLI",
        definition: "Command Line Interface. Conduktor CLI is an [artifact](#artifact) that communicates with other artifacts\' API. Two installation options are available: **native binary** or **Docker**. [Find out more](../guides/conduktor-in-production/deploy-artifacts/cli).",
        slug: "cli"
    },
    {
        term: "Cluster",
        definition: "A group of Kafka [brokers](#broker) working together to handle data streams. There are also clusters of Gateways (or Kafka Connect workers, Flink clusters, etc).",
        slug: "cluster"
    },
    {
        term: "Community",
        definition: "Conduktor Community is the free version. [Get started now](https://conduktor.io/get-started).",
        slug: "community"
    },
    {
        term: "Consumer",
        definition: "A Consumer in Kafka is an application that reads data from Kafka topics.",
        slug: "consumer"
    },
    {
        term: "Cortex",
        definition: "An [artifact](#artifact) `conduktor-console-cortex` that's deployed alongside [Console](#console) to provide it with the monitoring metrics. [Find out more](../guides/conduktor-in-production/deploy-artifacts/cortex)",
        slug: "cortex"
    },
    {
        term: "Data Mesh",
        definition: "A decentralized approach to data architecture where domain teams own their data. [Find out more](https://www.datamesh-architecture.com).",
        slug: "data-mesh"
    },
    {
        term: "Data streaming governance",
        definition: "Centralized control over streaming data, ensuring security, compliance, and efficient operations.",
        slug: "data-streaming-governance"
    },
    {
        term: "Desktop",
        definition: "A legacy Conduktor product (Desktop Application). Will be sunsetted by 2026. [Find out more and get support with your migration](https://conduktor.io/desktop)",
        slug: "desktop"
    },
    {
        term: "DLQ",
        definition: "Dead Letter Queue: A Kafka topic where unprocessable messages are stored for debugging.",
        slug: "dlq"
    },
    {
        term: "EDA",
        definition: "Event-Driven Architecture: A software design pattern where systems react to events in real-time.",
        slug: "eda"
    },
    {
        term: "EDM",
        definition: "Enterprise Data Management: the practice of centrally governing, securing and optimizing data across an organization. Conduktor\'s focus and uniqueness is on EDM for data streaming, designed for managing real-time data streaming at scale, ensuring security, compliance and governance. [Book a demo](https://conduktor.io/contact/demo).",
        slug: "edm"
    },
    {
        term: "Exchange",
        definition: "Conduktor product for sharing and receiving streaming data across teams and trusted partners — without added overhead or data duplication. Turn real-time data into revenue. [Find out more](https://conduktor.io/exchange).",
        slug: "exchange"
    },
    {
        term: "Data hub",
        definition: "Use Conduktor's data hub to drive real-time decisions by fully controlling your operational data and how it flows through your organization. [Book a demo](https://conduktor.io/contact/demo).",
        slug: "data-hub"
    },
    {
        term: "Gateway",
        definition: "A network proxy for Apache Kafka, where most of the Conduktor magic happens. Available as a Docker image (`conduktor-gateway`). [Find out more](../guides/conduktor-in-production/deploy-artifacts/gateway).",
        slug: "gateway"
    },
    {
        term: "Interceptor",
        definition: "Conduktor interceptors are configurable plugins of Conduktor Gateway that allow any part of Kafka protocol to be observed, manipulated and transformed. [Find out more](../guides/conduktor-concepts/interceptors).",
        slug: "interceptor"
    },
    {
        term: "Kafka Connect",
        definition: "A tool for integrating Kafka with external data sources.",
        slug: "kafka-connect"
    },
    {
        term: "Kafkademy",
        definition: "Conduktor's free online learning site on all things Kafka. [Check it out](https://learn.conduktor.io/kafka/).",
        slug: "kafkademy"
    },
    {
        term: "ksqlDB",
        definition: "A streaming SQL engine for real-time analytics on Kafka.",
        slug: "ksqlDB"
    },
    {
        term: "Message retention",
        definition: "How long Kafka stores messages before they are deleted.",
        slug: "message-retention"
    },
    {
        term: "Partition",
        definition: "A subset of a topic that helps distribute load across multiple [brokers](#broker).",
        slug: "partition"
    },
    {
        term: "Platform",
        definition: "Conduktor Platform refers to the overall Conduktor offering that combines all artifacts (such as `conduktor-console` and `conduktor-gateway`).",
        slug: "platform"
    },             
    {
        term: "Console",
        definition: "This is the Conduktor offering that you can see - it has the UI and provides access to our APIs. Console is available as a Docker image (`conduktor-console`). [Find out more](../guides/conduktor-in-production/deploy-artifacts/console).",
        slug: "Console"
    },       
    {
        term: "Policy",
        definition: "A Policy is a collection of validation [Rules](#rule) that are applied to topics or prefixes. Policies can have actions assigned which will take effect when specified criteria is met. For example, the processing of messages is blocked when a violation occurs. [Find out more](../guides/use-cases/rules-policies).",
        slug: "policy"
    },       
    {
        term: "Rule",
        definition: "A Rule is a CEL expression that captures business logic for your data. You then attach the Rule(s) to a [Policies](#policy) which will validate data at the streaming layer before messages are processed. [Find out more](../guides/use-cases/rules-policies).",
        slug: "rule"
    },             
    {
        term: "Producer",
        definition: "A producer in Kafka is an application that writes data to Kafka topics.",
        slug: "producer"
    },       
    {
        term: "Product",
        definition: "Each Conduktor product (such as [Scale](#scale)) is a collection of [artifacts](#artifact). Each product uses different artifacts based on the license tier to provide business value. [Find out more](https://conduktor.io/pricing).",
        slug: "product"
    },       
    {
        term: "Scale",
        definition: "Conduktor product for organizations scaling data streaming use cases and users, empowering teams to manage resources autonomously. [Find out more](https://conduktor.io/scale).",
        slug: "scale"
    },   
    {
        term: "Shield",
        definition: "Conduktor product for organizations looking to adhere to regulatory compliance, protect sensitive information and ensure business continuity. [Find out more](https://conduktor.io/shield).",
        slug: "shield"
    }, 
    {
        term: "Schema Registry",
        definition: "A central repository for managing Kafka message schemas, ensuring compatibility.",
        slug: "schema-registry"
    },       
    {
        term: "Self-service",
        definition: "A GitOps framework within [Scale](#scale) that provides developer autonomy. [Find out more](../guides/use-cases/self-service).",
        slug: "self-service"
    },       
    {
        term: "Streaming observability",
        definition: "Visibility into the health and performance of data streams, enabling proactive troubleshooting.",
        slug: "streaming-observability"
    },       
    {
        term: "Terraform",
        definition: "To terraform means to prepare/transform data so it can be used as code. Conduktor uses Alpha as the terraform provider. [Find out more](../guides/conduktor-in-production/automate/terraform-automation).",
        slug: "terraform"
    },       
    {
        term: "Topic",
        definition: "A category to which records (messages) are sent and from which they are consumed.",
        slug: "topic"
    },   
    {
        term: "Trust",
        definition: "Conduktor product for organizations looking to proactively enforce data quality and observability in their streaming ecosystem. Preventing costly issues early and driving reusable data products, while protecting downstream apps, analytics, and AI from data pollution.",
        slug: "trust"
    },       
    {
        term: "Partner Zones",
        definition: "Partner Zones allow you to share Kafka [topics](#topic) with external partners selectively and securely. [Find out more](../guides/use-cases/third-party-data).",
        slug: "partner-zones"
    },       
    {
        term: "Chargeback",
        definition: "Chargeback lets you visualize the cost allocation of [service accounts](#service-account) on a few key metrics. [Find out more](../guides/use-cases/chargeback).",
        slug: "chargeback"
    }, 
    {
        term: "Service account",
        definition: "You can define two types of service accounts in [Gateway](#gateway): **local** or **external**. [Find out more](../guides/conduktor-concepts/gw-service-accounts).",
        slug: "service-account"
    },   
    {
        term: "Indexing",
        definition: "Indexing is a background process in [Console](#console) that collects changes in an internal table, in turn allowing you to perform actions like sort, filter and much more, which you couldn't do with any out-of-the-box Kafka implementations. [Find out more](../guides/conduktor-concepts/indexing).",
        slug: "indexing"
    },    
  ];
  
  export default glossaryTerms;
