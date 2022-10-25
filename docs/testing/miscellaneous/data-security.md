---
sidebar_position: 2
---

# Data Security

## How is my data and configurations used?

When you use Conduktor Testing, some information is shared with our platform. You can find more information about data that may be collected when you use our products via the [privacy policy](https://www.conduktor.io/privacy-policy).

For Conduktor Testing to provide most value, we store some data relating to your test executions. This enables you to inspect data associated with a historical test execution.&#x20;

Information we store:

- Cluster configurations
- Records consumed from Kafka [consumer](../features/building-tests/tasks/consumer-task) tasks
- Metadata captured from Kafka [producer](../features/building-tests/tasks/producer-task) tasks
- Metrics relating to test executions (for example, the execution duration, test passes/failures)

### Opting out of data storage

If you are concerned about the storage of Kafka record data or metadata on our platform, you have controls to opt-out of storage within the application.

#### Scenario Execution

To opt-out of record and check data being stored when you execute a test, use the run configuration modal in the editor view.

Options:

- **Redact record data:** Any record data that can be later previewed when visiting a test execution will be redacted.
- **Redact check data:** Any data associated with a test check will be redacted when visiting a historical execution.&#x20;

![](<../assets/image (96).png>)

To demonstrate the impact of using the redaction tools:

_When previewing the consumed record, you will not be able to see **message key/value** content_

![](<../assets/image (165).png>)

#### Test Suite Execution

To opt-out of record and check data being stored when you execute a test suite, you have the same configurable options.

- **Redact record data:** Any record data that can be later previewed when visiting a test execution will be redacted.
- **Redact check data:** Any data associated with a test check will be redacted when visiting a historical execution.&#x20;

![ ](<../assets/image (101).png>)

## Analytics / Error Reporting

We capture analytics and error events so that we can improve our platform for users. Data is anonymized and nothing sensitive (PII - Personally Identifiable Information) is captured by these tools.

- **Segment**: Used to capture user behavioural data that is anonymized. This allows us to understand if users are having issues navigating the application, or finding new features.
- **Sentry:** Only in case of errors, we send the error events to Sentry that provide us visibility of an issue.
- **Datadog:** Anonymized \*\*\*\* RUM metrics that provide insight into the experience of users for performance, error management, analytics and support.&#x20;

## Support

If you have any questions, or need any further clarifications, please you the support widget inside Conduktor Testing.

The widget can be found \*\*\*\* in the bottom-right corner of all screens.

![](<../assets/image (103).png>)
