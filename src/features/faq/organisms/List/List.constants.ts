export const items = [
  {
    question: "How does Conduktor Cloud differ from the 'Self-Managed' version of Conduktor?",
    answer:
      'Conduktor Cloud offers the same capabilities, including all our solutions, scalability, and resiliency available in our self-managed software, but without having to worry about installation or cluster administration.',
  },
  {
    question: 'What services are provided in the Conduktor Cloud?',
    answer:
      'Conduktor automatically provisions infrastructure, deploys and configures cluster software, maintains availability, provides scalability, performs backups, and handles software upgrades including Conduktor, operating system, and system software.',
  },
  {
    question: 'Can I use Active Directory for SSO?',
    answer:
      'Yes. We support any OIDC, Active Directory, or LDAP standard identity provider. Further this does not require a connection back to Conduktor. It integrates directly with your identify provider.',
  },
  {
    question: 'How can we deploy Conduktor Platform?',
    answer:
      'We have two distribution models; Either a docker container that you can deploy wherever you like, or a managed option (Conduktor Cloud), where we run the Platform for you and you connect it to your Kafka environment.<br/><br/>With the Docker container you can run Conduktor in any platform that runs Docker containers (ECS/EKS/Fargate, EC2, Kubernetes, GKE, Azure Container service, etc.).',
  },
  {
    question: 'Does Role Based Access Contol (RBAC) in Conduktor platform apply to Kafka also?',
    answer:
      "Right now it does not. It's on our roadmap to make RBAC trickle down to Kafka ACLs also.",
  },
  {
    question: 'Can we use IAM + MSK?',
    answer:
      'Yes!  Conduktor does not currently support modifying IAM policies but is fully compatible with IAM for MSK authentication.',
  },
  {
    question: 'Do you have a Helm chart for deploying in my Kubernetes environment?',
    answer: 'We are working on a helm chart and will make this available soon.',
  },
  {
    question: 'Is access to the internet required to run the Conduktor Platform?',
    answer:
      'No, you can run an air gapped docker image in your environment without internet access.',
  },
  {
    question: 'Can we externalize Postgres & other data storage?',
    answer:
      'Yes!  The instructions for doing this can be found <a href="https://github.com/conduktor/conduktor-platform/blob/main/doc/Configuration.md#external-database-configuration" target="_blank">here</a>.',
  },
  {
    question: 'What schema registries do you support?',
    answer:
      'Conduktor currently supports Confluent Schema Registry, as well as AWS Glue Schema registry.',
  },
  {
    question: 'Do you have Terraform or CloudFormation?',
    answer:
      'We currently have a public cloud formation available <a href="https://github.com/conduktor/quickstart-conduktor-aws-msk" target="_blank">here</a>.',
  },
  {
    question:
      'Do you have a managed (SaaS) option?  When will it have feature parity with the Docker installation?',
    answer:
      'We have fully managed SaaS as an option. You can sign up <a href="https://signup.conduktor.io/" target="_blank">here</a>.<br/><br/>Currently, Monitoring is unavailable in Conduktor Cloud. However, we expect to have parity beetween Docker and SaaS by January 2023.',
  },
  {
    question: 'What kind of compliance requirements does your SaaS product satisfy?',
    answer: 'None for now. However, we are working on a SOC 2 Type 2 compliance.',
  },
  {
    question:
      'What is different about Conduktor Testing from other options such as test containers and jUnit?',
    answer:
      'Conduktor testing is an end-to-end and integration testing environment. It is designed to be used by multiple teams to share knowledge and provide global visibility of test strategy throughout an organization.  In addition, Conduktor Testing provides data validation and data checks at each step of a distributed system. This ensures both data correctness and application resilience.',
  },
  {
    question: 'What is the suggested settings for running the docker image?',
    answer:
      'We suggest you add a docker volume. If you fail to add the second --mount option each time you restart the docker container your settings and metrics will be erased. See our Docker Quick Start guide for exact commands.',
  },
  {
    question: 'I want to run this docker image in AWS Fargate/ECS/EKS, how can I do that?',
    answer:
      'We are working on a manifest as well as helm chart to enable this.  For now, deploying Conduktor platform as a single container works for most folks. <a href="https://docs.docker.com/get-started/kube-deploy/" target="_blank">https://docs.docker.com/get-started/kube-deploy/</a> has instructions.',
  },
  {
    question: 'What are the suggested resources that should be dedicated to Conduktor Platform?',
    answer:
      'We are working on a Helm chart to enable this.  For now, deploying Conduktor platform as a single container works for most folks.  See <a href="https://docs.docker.com/get-started/kube-deploy/" target="_blank">https://docs.docker.com/get-started/kube-deploy/</a> for more instructions.',
  },
  {
    question: 'Do you have an overview video of the Platform features?',
    answer:
      'Sure! You can see our platform hands on with Stephane Mareek <a href="https://www.youtube.com/watch?v=SnLv2yL5sy0" target="_blank">here</a>, get a free demo and discussion with us <a href="https://www.conduktor.io/contact/demo" target="_blank">here</a>, or try it on our demo environment <a href="https://www.conduktor.io/get-started#option-3" target="_blank">here</a>.',
  },
  {
    question:
      'If I have licenses of Conduktor Desktop is it still account.conduktor.io where I manage these licenses, add/remove etc?',
    answer:
      'Yes, if you have licenses of Conduktor Desktop you manage them via account.conduktor.io. Please see more information on account management for Conduktor Desktop <a href="https://docs.conduktor.io/portal/account-management" target="_blank">here</a>. If you are using Conduktor Platform you will manage the users of your subscription from the Admin section of your deployment, whether using Conduktor Cloud or our docker image on your environment. Please see a working example on our live demonstration <a href="https://demo.conduktor.io/admin/" target="_blank">here</a>',
  },
  {
    question: 'Does the Data Masking solution make any changes to my Kafka data?',
    answer: 'No it does not. The data is masked on the Conduktor Platform only.',
  },
  {
    question:
      'If I am currently using JMX exporter on a specific port, how do I utilize Conduktor Platforms Monitoring features? Do I have to use a specific port?',
    answer:
      'You can use the port you are currently using, just change the configuration called jmxScrapePort as shown <a href="https://github.com/conduktor/conduktor-platform/blob/main/doc/Environment_Override.md#property-definitions" target="_blank">here</a>.',
  },
  {
    question:
      'What other integrations are planned for Monitoring and Alerting? For example, MS Teams, Email?',
    answer: 'We plan to have webhooks available so you can integrate with other services.',
  },
  {
    question: 'How are the cluster credentials I enter on the platform stored?',
    answer:
      'They are secrets that are encrypted to/from the DB (via AES encryption algorithm), of which the key is accessible only via our internal DevOps team.',
  },
  {
    question:
      'Are the timestamps in Conduktor Console for Kafka messages based on Local time or Coordinated Universal Time(UTC)?',
    answer:
      'The timestamps of Kafka messages on Conduktor Console are based on the local time zone of the user. Our team are working on functionailty to allow users be able to choose between either local time and UTC on Conduktor Console.',
  },
]
