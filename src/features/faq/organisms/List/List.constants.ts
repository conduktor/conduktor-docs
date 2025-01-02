export const items = [
  {
    question: 'Can I use Active Directory for SSO?',
    answer:
      'Yes. We support any OIDC, Active Directory, or LDAP standard identity provider. Further this does not require a connection back to Conduktor. It integrates directly with your identify provider. View all our options for configuring SSO <a href="https://docs.conduktor.io/platform/category/configure-sso/" target="_blank">here</a>  ',
  },
  {
    question: 'How can we deploy Conduktor?',
    answer:
      'Conduktor runs as docker container that you can deploy wherever you like. With the Docker container you can run Conduktor in any platform that runs Docker containers (ECS/EKS/Fargate, EC2, Kubernetes, GKE, Azure Container service, etc.). See the full list of deployment guides here <a href="https://docs.conduktor.io/platform/category/deployment-options/" target="_blank">here</a>',
  },
  {
    question: 'Does Role Based Access Control (RBAC) in Conduktor platform apply to Kafka also?',
    answer:
      "No - Conduktor's Role-Based Access Control (RBAC) model is designed to manage user permissions within the Conduktor platform, specifically for interacting with Kafka resources through Conduktor's interface. However, in Conduktor's self-service model, the platform facilitates the creation of Access Control Lists (ACLs) based on applications. This approach allows application teams to manage their Kafka resources autonomously, ensuring that each application has the necessary permissions to interact with Kafka topics, consumer groups, and other resources. ",
  },
  {
    question: 'Can we use IAM + MSK?',
    answer:
      'Yes!  Conduktor does not currently support modifying IAM policies but is fully compatible with IAM for MSK authentication.',
  },
  {
    question: 'Do you have a Helm chart for deploying in my Kubernetes environment?',
    answer: 'Yes, checkout our <a href="https://docs.conduktor.io/platform/get-started/installation/get-started/kubernetes/" target="_blank">docs page</a>.',
  },
  {
    question: 'Is access to the internet required to run Conduktor?',
    answer:
      'No, you can run an air gapped Docker image in your environment without internet access.',
  },
  {
    question: 'Is an external database required to run Conduktor?',
    answer:
      'Yes! The external database is used to store platform configuration such as users and permissions. The instructions for doing this can be found <a href="https://docs.conduktor.io/platform/get-started/configuration/database/" target="_blank">here</a> and more information on system requirements can be found <a href="https://docs.conduktor.io/platform/get-started/installation/hardware/" target="_blank">here</a>.',
  },
  {
    question: 'What schema registries do you support?',
    answer:
      'Conduktor Console currently supports Confluent Schema Registry, as well as AWS Glue Schema registry. Conduktor Gateway supports Confluent Schema Registry only.',
  },
  {
    question: 'Do you have Terraform or CloudFormation?',
    answer:
      'Yes we have both a <a href="https://docs.conduktor.io/platform/reference/terraform-reference/" target="_blank">Terraform provider</a>, and a public <a href="https://docs.conduktor.io/platform/get-started/installation/get-started/CloudFormation/" target="_blank">CloudFormation</a>.',
  },
  {
    question: 'What kind of compliance certifications does Conduktor have?',
    answer: 'Conduktor is SOC 2 Type 2 compliant and conducts regular penetration testing on our products. The reports are available as requested.',
  },
  {
    question: 'What are the suggested resources that should be dedicated to Conduktor?',
    answer:
      'See the requirements pages for <a href="https://docs.conduktor.io/gateway/get-started/system-requirements/" target="_blank">Gateway</a>, or <a href="https://docs.conduktor.io/platform/get-started/installation/hardware/" target="_blank">Console</a> for more instructions.',
  },
  {
    question: 'What are the suggested settings for running the docker image?',
    answer:
      'Please see our system requirements for <a href="https://docs.conduktor.io/platform/get-started/installation/hardware/" target="_blank">Conduktor Console</a>, and system requirements for <a href="https://docs.conduktor.io/gateway/get-started/system-requirements/" target="_blank">Conduktor Gateway.</a>',
  },
  {
    question:
      'If I have licenses of Conduktor Desktop, do I still manage licenses through account.conduktor.io?',
    answer:
      'Yes, if you have licenses of Conduktor Desktop you manage them via account.conduktor.io. Please see more information on account management for Conduktor Desktop <a href="https://docs.conduktor.io/portal/account-management" target="_blank">here</a>. If you are using Conduktor Platform you will manage the users of your subscription from the Settings of your deployment.',
  },
  {
    question: 'Does the Console Data Masking solution make any changes to my Kafka data?',
    answer: 'No it does not. The data is masked is applied within the Conduktor UI at runtime for specified users and groups only. The underlying data in Kafka remains unchanged.',
  },
  {
    question:
      'Is a separate Docker image required to get the Monitoring and Alerting features of Conduktor?',
    answer:
      'Yes, the Conduktor deployment depends on an additional image `conduktor-console-cortex` to support monitoring and alerting capabilities. See how the configuration and dependencies should be declared in the <a href="https://docs.conduktor.io/platform/get-started/installation/get-started/docker/#advanced-setup" target="_blank">docker compose</a> example. ',
  },
  {
    question:
      'What platforms do the monitoring and alerting capabilities integrate with?',
    answer: 'Conduktor integrates with Microsoft Teams and Slack for third-party alerting. Conduktor also exposes metrics in <a href="https://docs.conduktor.io/platform/reference/metric-reference/" target="_blank">Prometheus format</a> so that they can be scraped and integrated with an external log management system.',
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
      'The timestamps of Kafka messages on Conduktor Console are based on the local time zone of the user. Hover over a timestamp within the Consumer view and you will also see the timestamp in UTC.',
  },
  {
    question:
      'My license permits me access to Console for 50 users - how are those users defined?',
    answer:
      'Conduktor considers a user as any distinct entry that is stored in the users database, regardless of whether they have ever logged in, or are attached to any existing Groups. Entries are created in the users database when the first admin account(s) are created, users are added via basic authentication, or users log in via SSO (or, are explicitly added inside the Conduktor UI prior to their first login via SSO). From within the Settings > Users list, you can see how many users exist in your organization, and remove a user by choosing the delete member option',
  },
  {
    question:
      'What happens if I exceed my user threshold?',
    answer:
      'Conduktor employs a soft limit to ensure that your service is not disrupted in cases whereby you onboard more users than you expected. We understand it can be difficult to plan in advance, and ask you get in contact with your Customer Success team if you exceed your user threshold. Please note this limit is a contractual agreement between Conduktor and your company, and may be subject to auditing from time to time.',
  },
  {
    question:
      'I cannot see the last active date of a user, how can I perform a clean-up?',
    answer:
      'You can review the last login time of a user from within the Settings > Users view. '
  }
]
