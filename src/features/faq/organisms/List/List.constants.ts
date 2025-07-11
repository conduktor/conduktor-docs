export const items = [
  {
    question: 'Can I use Active Directory for SSO?',
    answer:
      'Yes. We support any OIDC, Active Directory or LDAP standard identity provider. Moreover, this doesn\'t require a connection back to Conduktor - it integrates directly with your identify provider. View all our options for configuring SSO <a href="https://docs.conduktor.io/platform/category/configure-sso/" target="_blank">here</a>  ',
  },
  {
    question: 'How can we deploy Conduktor?',
    answer:
      'Conduktor runs as Docker container that you can deploy and run Conduktor in any platform that runs Docker containers (ECS/EKS/Fargate, EC2, Kubernetes, GKE, Azure Container service, etc.). See the full list of deployment guide here <a href="https://docs.conduktor.io/platform/category/deployment-options/" target="_blank">here</a>',
  },
  {
    question: 'Does Role Based Access Control (RBAC) in Console also apply to Kafka?',
    answer:
      "No, Conduktor's RBAC model is designed to manage user permissions within the Conduktor Console, specifically for interacting with Kafka resources through Conduktor's interface. However, using Conduktor's Self-service, you can create Access Control Lists (ACLs) based on applications. This allows application teams to manage their Kafka resources autonomously, ensuring that each application has the necessary permissions to interact with Kafka topics, consumer groups and other resources. ",
  },
  {
    question: 'Can we use IAM for MSK?',
    answer:
      'Yes, Conduktor doesn\'t currently support modifying IAM policies but is fully compatible with IAM for MSK authentication.',
  },
  {
    question: 'Do you have a Helm chart for deploying in my Kubernetes environment?',
    answer: 'Yes, check out our <a href="https://docs.conduktor.io/platform/get-started/installation/get-started/kubernetes/" target="_blank">docs page</a>.',
  },
  {
    question: 'Is access to internet required to run Conduktor?',
    answer:
      'No, you can run an air gapped Docker image in your environment without internet access.',
  },
  {
    question: 'Is an external database required to run Conduktor?',
    answer:
      'Yes, the external database is used to store platform configuration such as users and permissions. The instructions for doing this can be found <a href="https://docs.conduktor.io/platform/get-started/configuration/database/" target="_blank">here</a> and more information on system requirements can be found <a href="https://docs.conduktor.io/platform/get-started/installation/hardware/" target="_blank">here</a>.',
  },
  {
    question: 'What schema registries do you support?',
    answer:
      'Conduktor supports Confluent schema registry, as well as AWS Glue schema registry.',
  },
  {
    question: 'Do you have Terraform or CloudFormation?',
    answer:
      'Yes, we have both a <a href="https://docs.conduktor.io/platform/reference/terraform-reference/" target="_blank">Terraform provider</a>, and a public <a href="https://docs.conduktor.io/platform/get-started/installation/get-started/CloudFormation/" target="_blank">CloudFormation</a>.',
  },
  {
    question: 'What kind of compliance certifications does Conduktor have?',
    answer: 'Conduktor is SOC 2 Type 2 compliant and conducts regular penetration testing on our products. The reports are available on request.',
  },
  {
    question: 'What are the suggested resources that should be dedicated to Conduktor?',
    answer:
      'See the requirements page for <a href="https://docs.conduktor.io/gateway/get-started/system-requirements/" target="_blank">Gateway</a>, or <a href="https://docs.conduktor.io/platform/get-started/installation/hardware/" target="_blank">Console</a> for more instructions.',
  },
  {
    question: 'What are the suggested settings for running the Docker image?',
    answer:
      'See the system requirements for <a href="https://docs.conduktor.io/platform/get-started/installation/hardware/" target="_blank">Conduktor Console</a> and system requirements for <a href="https://docs.conduktor.io/gateway/get-started/system-requirements/" target="_blank">Conduktor Gateway.</a>',
  },
  {
    question:
      'If I have Conduktor Desktop licenses, do I still manage licenses through account.conduktor.io?',
    answer:
      'Yes. Find out more about account management for Conduktor Desktop <a href="https://docs.conduktor.io/portal/account-management" target="_blank">here</a>. If you\'re using Conduktor Console, you can manage your subscription in **Settings**.',
  },
  {
    question: 'Does Console\'s data masking make any changes to my Kafka data?',
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
    answer: 'Conduktor integrates with Microsoft Teams, Slack and webhooks. Conduktor also exposes metrics in <a href="https://docs.conduktor.io/platform/reference/metric-reference/" target="_blank">Prometheus format</a> so that they can be scraped and integrated with an external log management system.',
  },
  {
    question: 'How are the cluster credentials stored?',
    answer:
      'The credentials entered in Console are stored as secrets that are encrypted to/from the database (via AES encryption algorithm). The key is accessible only via your internal DevOps team.',
  },
  {
    question:
      'Are the timestamps in Conduktor Console for Kafka messages based on local time or Coordinated Universal Time (UTC)?',
    answer:
      'The timestamps of Kafka messages on Conduktor Console are based on the local time zone of the user. Hover over a timestamp in the consumer view and you\'ll also see the timestamp in UTC.',
  },
  {
    question:
      'My license allows a certain number of users to access Console. How are users defined?',
    answer:
      'Conduktor considers a user as any distinct entry that\'s stored in the users database, regardless of whether they\'ve ever logged in/are attached to any existing groups or not. Entries are created in the users database when: the first admin account(s) are created, users are added via basic authentication or users log in via SSO (or are added explicitly to the Conduktor UI prior to their first login via SSO). Go to **Settings** > **Users** page to manage the user list.',
  },
  {
    question:
      'What happens if I exceed my user threshold?',
    answer:
      'Conduktor employs a soft limit to ensure that your service is not disrupted in cases where you onboard more users than expected. We understand it can be difficult to plan in advance and ask you get in touch with your customer success team if you exceed your user threshold. Please note this limit is a contractual agreement between Conduktor and your company, and may be subject to auditing from time to time.',
  },
  {
    question:
      'I can\'t see the last active date of a user, how can I perform a clean-up?',
    answer:
      'You can review the last login time of a user in Console by going to **Settings** > **Users**.'
  }
]
