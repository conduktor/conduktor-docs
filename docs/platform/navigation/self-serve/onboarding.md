---
sidebar_position: 1
title: Migrating / Onboarding Applications
description: Kafka Self Serve Overview
---

As you progressively onboard new Application Teams to Self Service, you will eventually be confronted to the following scenario:
- Application `Wikipedia` is onboarded in Self Service.
- Application `Clickstream` hasn't migrated to Self Service yet.
- Application `Wikipedia` needs to access Application `Clickstream`'s topic.
- 😱

Don't worry, there's a hidden rule for Platform Administrators.  
Un-owned resources in Self Service (that is, all resources that are not linked to Application declared in Self Service) are owned by Platform Administrator.

What is means, is that as a Platform Administrator, you can deploy the following resource:
```yaml
---
apiVersion: "v1"
kind: "ApplicationInstancePermission"
metadata:
  application: "UNASSIGNED"
  name: "clickstream-app-prod-to-wiki"
spec:
  resource:
    type: TOPIC
    name: "clickstream.topic"
    patternType: LITERAL
  permission: READ
  grantedTo: wiki-app-prod

```

As soon as `Clickstream` application will get onboarded, because their ApplicationInstance will assign ownership on topic `clickstream.`, then automatically 
- the declared ApplicationInstancePermission will become theirs to manage
- the Platform Administrator Team will loose control of the ApplicationInstancePermission
- 🚀