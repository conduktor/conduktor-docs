---
sidebar_position: 600
title: Get support
description: Get help and support with using Conduktor.
---

## Get help or support

- [Contact support](https://www.conduktor.io/contact/support)
- [**Already a customer?** Check the status of an open issue or raise a new ticket](https://support.conduktor.io/hc/en-gb/signin?return_to=https%3A%2F%2Fsupport.conduktor.io%2Fhc%2Fen-gb%2Frequests%2Fnew%3Fticket_form_id%3D17438312520209)
- [Join Conduktor on Slack](https://www.conduktor.io/slack)
- [Arrange a technical demo](https://www.conduktor.io/contact/demo)
- [Raise a feature request](https://support.conduktor.io/hc/en-gb/requests/new)

## Check out other resources

- [Release notes](/changelog)
- [View our version policy](/support)

## Support portal

In order to provide support to our customers and users, we have a dedicated Support Portal where you can track your issues and get help from our team.

You can find this Conduktor Support Portal at [**support.conduktor.io**](https://support.conduktor.io).

![Support Portal](/guides/support-portal.png)

In this Support Portal, you can ask us about everything Conduktor-related and we will point you to the right resources to help you. This covers bugs, feature requests, billing enquiries, license management, ...

### Knowledge Base

When you arrive on the Support Portal, you will find a Knowledge Base with articles that can help you solve common issues or answer your questions.

Here is a breakdown of our current sections:
  - **Get Started**: Pointers to help you get started with Conduktor containers and Support Portal.
  - **Troubleshooting**: Articles to help you troubleshoot common issues.
  - **Account and Billing**: Explanations to manage your licenses and billing.
  - **New Releases**: Release notes for each new Console and Gateway release.

:::note
If you want to **get alerted by email every time we release a new version**, you can **follow** our [Console](https://support.conduktor.io/hc/en-gb/sections/16400553827473-Conduktor-Console) and [Gateway](https://support.conduktor.io/hc/en-gb/sections/16400521075217-Conduktor-Gateway) release sections!

See [here](https://support.conduktor.io/hc/en-gb/articles/20131942687889-How-to-get-notified-when-there-is-a-new-version-of-Conduktor-Console-or-Gateway) for more details.
:::

### Submit a Request

If you're having an issue, the Support Portal is the best way to get help from the Conduktor Support team.

You can submit a request by clicking on the **Submit a request** button in the top right corner of the page.

Then, you simply have to fill out the form with your issue details and click on **Submit**.

![Submit a Request](/guides/support-form.png)

If you aren't already logged in, you'll get asked to fill in your email. Otherwise, we will use the email associated with your account.

:::info
Please make sure you give us **as much context as possible** to help us understand your issue and solve it quickly! We'd love to get logs, screenshots, and any other information that can help us. Any details you can provide will be appreciated.
:::

At the end of this process, you'll get an email confirmation with a ticket number. You can use this ticket number to track your issue on the Support Portal.

### Track your Requests

Once you've submitted a request, you can track your issues by clicking on your profile in the top right corner and selecting **Requests**.

![List of requests](/guides/support-requests.png)

Feel free to customize the columns by selecting which ones you want to see, and sorting them by clicking on the column header.

On this page, you can see:
  - Your requests
  - The requests you've been CC'd on
  - The requests submitted by your other colleagues (this needs a manual action on our side, please open a ticket if you'd like to enable it for your organization)

To see the content of a request, click on the subject of the request. You'll then be able to see the full conversation, and reply to us if necessary.


## Data privacy using Conduktor

### Configuration: on your disk

Conduktor Gateway is installed on your infrastructure and stores its configuration on your disk and Kafka cluster. It is not stored nor sent anywhere else.

Conduktor Gateway will store usernames & passwords you supply to connect to different technologies such as Apache Kafka, Schema Registry etc.

### Data: not sent anywhere

The message data only moves between your Conduktor Gateway, on your infrastructure, and your Apache Kafka clusters and ecosystem (Schema Registry, Kafka Connect, Kafka Streams, ksqlDB, ...). This is never sent anywhere else.

## Where is Conduktor installed?

Conduktor Gateway runs as a Docker container that you can deploy using on any Docker or Kubernetes type environment, either self-hosted or cloud based.

## Support / Analytics / Error reporting

We collect basic information about authentication mechanism types to better understand and improve how customers can connect to Gateway such as the SASL mechanism and security protocol types used, sensitive data is never collected.

## Image Vulnerabilities

As part of our development process our images are scanned for any vulnerabilities that have been identified by the community, we updated any necessary libraries to remove them where available.

We use several tools (Dependabot, Snyk, Docker Scout, Harbor, Grype, etc....) to detect vulnerabilities as part of our engineering pipelines, several of these tests are triggered for every commit. We are constantly upgrading our libraries to rely on the most recent / secured versions. The pipeline prevents us from releasing if there are any Critical or High vulnerabilities.

We also regularly run pen-testing campaigns with third-party companies and always enjoy partnering with customers when they organize similar campaigns on their side.

As part of SOC2 certification, Conduktor has developed clear procedures for incident response and tracking their resolution. This is discussed further on our [blog](https://conduktor.io/blog/what-we-learned-from-soc2-type2-write-what-you-do-do-what-you-write).
