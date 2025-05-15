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
        definition: "The underlying components that power our products (e.g. Scale). Currently, these components are packaged as Docker images AKA artifacts. Artifacts are what you deploy in your infrastructure and connect to Kafka/other systems to get business value. The artifacts today are: `conduktor-console`, `conduktor-console-cortex`, `conduktor-gateway`.",
        slug: "artifact"
    },
    {
        term: "CLI",
        definition: "Command Line Interface. [Conduktor CLI](../guides/conduktor-in-production/deploy-artifacts/cli) is an artifact that communicates with other artifacts' API. There are two options for installing Conduktor CLI: native binary or Docker.",
        slug: "cli"
    },
    {
        term: "Cluster",
        definition: "A group of Kafka brokers working together to handle data streams. There are also clusters of Gateways (or Kafka Connect workers, Flink clusters, etc).",
        slug: "cluster"
    },
    {
        term: "Community",
        definition: "Conduktor Community is the free version.",
        slug: "community"
    },
    {
        term: "Consumer",
        definition: "A Consumer in Kafka is an application that reads data from Kafka topics.",
        slug: "consumer"
    },
    {
        term: "Cortex",
        definition: "An artifact (`conduktor-console-cortex`) that's deployed alongside Platform to provide it with the monitoring metrics.",
        slug: "cortex"
    },
    {
        term: "Data Mesh",
        definition: "A decentralized approach to data architecture where domain teams own their data. [Find out more](https://www.datamesh-architecture.com).",
        slug: "data-mesh"
    },
    {
        term: "Data Streaming Governance",
        definition: "Centralized control over streaming data, ensuring security, compliance, and efficient operations.",
        slug: "data-streaming-governance"
    },
    {
        term: "Desktop",
        definition: "A legacy Conduktor product (Desktop Application). Will be sunsetted by 2026.",
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
        definition: "Enterprise Data Management is the practice of centrally governing, securing, and optimizing data across an organization. Conduktor\'s focus and uniqueness is on EDM for data streaming, designed for managing real-time data streaming at scale, ensuring security, compliance, and governance.",
        slug: "edm"
    },
    {
        term: "Exchange",
        definition: "Conduktor product for sharing and receiving streaming data across teams and trusted partners — without added overhead or data duplication. Turn real-time data into revenue. [Find out more](https://conduktor.io/exchange).",
        slug: "exchange"
    },
    {
        term: "Data hub",
        definition: "Use Conduktor's data hub to drive real-time decisions by fully controlling your operational data and how it flows through your organization. [Find out more](https://conduktor.io).",
        slug: "data-hub"
    },
    {
        term: "Shield",
        definition: "Description. [Find out more](https://conduktor.io/shield).",
        slug: "shield"
    },
    {
        term: "Scale",
        definition: "Description. [Find out more](https://conduktor.io/scale).",
        slug: "scale"
    },
    {
        term: "Gateway",
        definition: "A network proxy for Apache Kafka, where most of the Conduktor magic happens. Available as a Docker image (`conduktor-gateway`). [Find out more](../guides/conduktor-in-production/deploy-artifacts/gateway).",
        slug: "gateway"
    },
    {
        term: "Interceptors",
        definition: "Conduktor interceptors are configurable plugins of Conduktor Gateway that allow any part of Kafka protocol to be observed, manipulated and transformed. [Find out more](../guides/conduktor-concepts/interceptors).",
        slug: "interceptors"
    },
    {
        term: "Kafka Connect",
        definition: "A tool for integrating Kafka with external data sources.",
        slug: "kafka-connect"
    },
    {
        term: "Term",
        definition: "Description.",
        slug: "term"
    },
    {
        term: "Term",
        definition: "Description.",
        slug: "term"
    },
    {
        term: "Term",
        definition: "Description.",
        slug: "term"
    },
    {
        term: "Term",
        definition: "Description.",
        slug: "term"
    },
    {
        term: "Term",
        definition: "Description.",
        slug: "term"
    },             



















  ];
  
  export default glossaryTerms;
