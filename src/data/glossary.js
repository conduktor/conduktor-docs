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
        term: "Shield",
        definition: "Conduktor product for.......... [Find out more](https://conduktor.io/shield).",
        slug: "shield"
    },
    {
        term: "Scale",
        definition: "Conduktor product for............... [Find out more](https://conduktor.io/scale).",
        slug: "scale"
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
        definition: "A Policy is a collection of validation [Rules](#rules) that guide how data streaming environments are managed, monitored, and secured. These policies help organizations enforce best practices, security measures, and compliance requirements.",
        slug: "policy"
    },       
    {
        term: "Rule",
        definition: "A Rule is ",
        slug: "rule"
    },             
    {
        term: "Term",
        definition: "Description",
        slug: "term"
    },       
    {
        term: "Term",
        definition: "Description",
        slug: "term"
    },       
    {
        term: "Term",
        definition: "Description",
        slug: "term"
    },       
    {
        term: "Term",
        definition: "Description",
        slug: "term"
    },       
    {
        term: "Term",
        definition: "Description",
        slug: "term"
    },       
    {
        term: "Term",
        definition: "Description",
        slug: "term"
    },       
    {
        term: "Term",
        definition: "Description",
        slug: "term"
    },       
    {
        term: "Term",
        definition: "Description",
        slug: "term"
    },   
    {
        term: "Term",
        definition: "Description",
        slug: "term"
    },       
    {
        term: "Term",
        definition: "Description",
        slug: "term"
    },       
    {
        term: "Term",
        definition: "Description",
        slug: "term"
    },       
    {
        term: "Term",
        definition: "Description",
        slug: "term"
    },       
    {
        term: "Term",
        definition: "Description",
        slug: "term"
    },   










  ];
  
  export default glossaryTerms;
