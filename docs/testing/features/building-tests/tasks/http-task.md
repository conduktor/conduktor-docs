---
sidebar_position: 5
---

# HTTP Task

Use the **HTTP** task to test APIs that form part of your system architecture.&#x20;

This involves defining an API endpoint, the method, any relevant body data, headers, query parameters or authentication required for your API.

When making a request, you can make **checks** on the response data. Below outlines what you are able to test in regards to the response.

| Check Source  | Description                                     |
| ------------- | ----------------------------------------------- |
| Status Code   | The HTTP response status, e.g. 200              |
| JSON Body     | The response body parsed as JSON                |
| Headers       | The response headers (array of key/value pairs) |
| Response Time | The response time in ms                         |
| Response Size | The response size in bytes                      |

**Quick Links:**

- [Creating an HTTP Task](http-task#creating-an-http-task)
  - [Method & URL](http-task#method-and-url)
  - [Body](http-task#body)
  - [Query Parameters](http-task#query-parameters)
  - [Authentication](http-task#authentication)
- [Previewing Requests](http-task#undefined)
- [Combining HTTP & Kafka](http-task#combining-http-and-kafka)
  - [Example: REST Proxy & Kafka Consumer](http-task#example-rest-proxy-and-kafka-consumer)

## Creating an HTTP Task

When inside the editor for a new scenario, select the **Scenario Start** button and select **HTTP Request.**&#x20;

![](<../../../assets/image (168).png>)

### Method & URL

Give the task an appropriate name, then add the URL and method for your HTTP request.&#x20;

Supported methods:

- `GET`
- `POST`
- `DELETE`
- `HEAD`
- `PUT`
- `PATCH`
- `OPTIONS`

:::tip
**Pro Tip!** If your URL contains query parameters, you can use the **Parse query params** option to extract the key/value pairs into the query params module.
:::

![](<../../../assets/image (118).png>)

### Body

There are multiple options for appending body content to your request. Depending on the format selected, this will update the **Content-Type request** header.

#### Raw

Format your input using the below options:

- `JSON`
- `Text`
- `HTML`
- `XML`

#### Form (URL Encoded)

This allows you to input a list of key/value pairs to be appended to your request.

### Query Parameters

Expand the query parameters section to add query parameters to your request.&#x20;

:::info
You have flexibility to add query parameters automatically in the URL, or use the dedicated module to add them in a structured way.
:::

### Headers

Add HTTP header key/value pairs to append to your request.

For example:

- Accept: \*/\*
- Content-Type: application/vnd.kafka.json.v2+json

### Authentication

There are multiple options for adding authentication to your HTTP request.

#### Basic Auth

Add the username and _optional_ password in the provided inputs

#### Bearer Token

Add the token in the provided input.

#### Custom

If your API utilizes a custom authentication header, you can use this option to append it to your request.

## Previewing Requests

Before saving your HTTP task, use the `Preview` button to see if your request is constructed correctly.&#x20;

![](<../../../assets/image (29).png>)

It also gives you a chance to preview the response data, which is useful when adding checks.&#x20;

It will demonstrate the structure of any response data, and give an indication on the status code, response time and response size.

![](<../../../assets/image (39).png>)

## Combining HTTP & Kafka&#x20;

It's not uncommon to use a RESTful interface to interact with an Apache Kafka cluster.&#x20;

In Conduktor Testing, It's possible to chain together HTTP and Kafka tasks. This enables you to cover end-to-end scenarios that involve both protocols.

Common scenarios might include:

- Sending messages to a REST proxy that propagates it into a Kafka topic
- Validating a record via an API after it has been processed in Kafka&#x20;

### Example: REST Proxy & Kafka Consumer

In this example, we will demonstrate how to POST a record using an HTTP task to a REST proxy running on `localhost:8082`.

Equally, we will use a consumer task to validate that the message is propagated into the `web-events` topic as expected.

#### HTTP Task

- Create an HTTP task and provide the URL of your REST proxy
- Set the method to `POST`
- In the `Headers` section, set the `Content-Type` to `application/vnd.kafka.json.v2+json`
- Add the below record in the `Body` section, with the `JSON` option selected

```
{"records":[{"value":{"foo":"bar"}}]}
```

![](<../../../assets/image (10).png>)

On the **Checks** tab, add a validation on the response code.

- Select `Status code` as the source
- Add `200` as the plain value (200 = OK Success)

![](<../../../assets/image (27).png>)

#### Consumer Task

- Chained to the `On Response` port of the HTTP task, add a **Consumer** task to the canvas.
- Configure the Cluster and Topic that you expect to receive the message
- On the **Data** tab, choose `JSON` as the value format
- Leave the default **Lifecycle** conditions, assuming we only expect to consume 1 record
- Add a **Check** on the contents of the message, using the below conditions
  - `.record.value.foo` = bar

![](<../../../assets/image (5).png>)

#### Run Scenario

Run your scenario, and observe the execution events.

Preview the **HTTP request completed** event to see a summary of the event.&#x20;

![](<../../../assets/image (11).png>)

Assuming your HTTP request was configured correctly, you should see the status **`200 OK`** and detail about the message in the `Body` section.

Equally, previewing the `Record consumed` event will show the JSON message in the `Value` section under the Data tab.

![](<../../../assets/image (18).png>)

Finally, navigate to the **Checks** tab to see the result of the checks we made on:

- The HTTP response status code
- The consumed message content

![](<../../../assets/image (70).png>)
