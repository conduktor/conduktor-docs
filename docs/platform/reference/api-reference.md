---
sidebar_position: 2
title: API Reference
description: Conduktor Console gives you complete visibility into your Kafka ecosystem and the ability to manage and monitor your data streaming applications
---

# API Reference

## Overview

The Conduktor REST API can be used to manage your organizations Users, Groups and their associated Permissions. Additionally, it can be used to interact with Kafka resources that are added to your organization such as Clusters and Certificates.

**Open API documentation** portal is available on `/docs` of your deployment host (e.g. `http://localhost:8080/docs`).

Currently, only members of the Admin group can generate API keys and access the API.

:::info
Note that complete documentation for all endpoints is contained within the API documentation portal.
:::

## Access the Open API specification

The Open API documentation portal is available on `/docs` of your deployment host

e.g. `http://localhost:8080/docs`

From within the API documentation portal, you can **download** the OpenAPI specification. This allows you to import the OpenAPI specification in tools such as [Postman](https://www.postman.com/).

![api-specification.png](/img/get-started/api-specification.png)

## Generate an API key

To start using the Conduktor API, navigate to the 'API Keys' tab in Settings and generate a new API Key.

Select **Create API Key** to generate a new API key.

![api-token.png](/img/get-started/api-token.png)

## Example request

:::info
Note that complete documentation for all endpoints is contained within the API documentation portal.
:::

The following example lists the permissions associated with your group "project-a".

```bash
curl -X GET http://localhost:8080/public/v1/groups/project-a/permissions -H "Authorization: Bearer {token}"
[
    {
        "clusterId": "local",
        "topicPattern": "projectA-*",
        "permissions": [
            "topicConsume",
            "topicViewConfig"
        ],
        "resourceType": "Topic"
    },
    {
        "clusterId": "local",
        "consumerGroupPattern": "projectA-*",
        "permissions": [
            "consumerGroupView"
        ],
        "resourceType": "ConsumerGroup"
    }
]
```