---
title: API reference
displayed: false
description: Use Console or Gateway APIs
---

Conduktor offers the Console API and Gateway API, each used for managing different resources.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem  value="Console" label="Console API">

The Conduktor HTTP API can be used to manage your organizations users, groups and their associated permissions. You can also use it to interact with Kafka resources such as clusters and certificates.

[Go to the API portal](https://developers.conduktor.io/?product=console) or `/docs` in your deployment host (e.g., `http://localhost:8080/docs`).

Use the API portal to download the OpenAPI specification. You can then import it to tools such as [Postman](https://www.postman.com/).

### Manage API keys

In Console, go to **Settings** > **API Keys** to manage and create new keys.

Only members of the admin group can generate API keys and access the API.

### Example

Here's a sample request listing the permissions associated with group 'project-a':

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

</TabItem>
<TabItem  value="Gateway" label="Gateway API">

The Conduktor Gateway HTTP API can be used to manage your organizations Interceptors and other resources such as alias topics or topic concentration rules.

[Go to the API portal](https://developers.conduktor.io/?product=gateway) or the HTTP root page of your deployment host (e.g., `http://localhost:8888/`).

Use the API portal to download the OpenAPI specification. You can then import it to tools such as [Postman](https://www.postman.com/).

</TabItem>
</Tabs>
