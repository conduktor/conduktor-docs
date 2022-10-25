# Environments

Environments facilitate the storage of parameters and configurations that can be referenced in test scenarios.&#x20;

For example, attaching a **different cluster configuration** across **development**, **staging** and **production** environments.&#x20;

You can also use variables to store frequently referenced data. For example, a **message key** that's **frequently referenced** in your test scenarios.&#x20;

When you switch the environment for a test execution, your variables will be resolved without manual intervention. This will save you time when configuring tests.

## Create an environment

To get started, navigate to the **Environments** tab from the main navigation and select **Add new environment.**

![](<../../assets/image (133).png>)

Give your environment a **name** and select a **colour** to associate with the environment.

![](<../../assets/image (61).png>)

Your newly labelled environment will now be visible in your list of environments.

![](<../../assets/image (7) (1).png>)

## Create an environment variable

Now that you have an environment created, you can add environment variables.

Navigate to the **Variables** tab and select **Add new variable.**

![](<../../assets/image (128).png>)

You will be prompted to provide a **variable name** and define the **type.**&#x20;

Types:

- **Cluster:** Attach cluster configurations to different environments
- **String:** Attach a simple string value to a variable for use in test scenarios.

![](<../../assets/image (33).png>)

Now that you have created a variable, you can assign it a value for each environment that you have created.&#x20;

_In the below example, a different cluster is attached to Production and Staging environments._

_Similarly, a different string value has been attached to the variable topic-key for each environment._

![](<../../assets/image (66).png>)

Continue to learn about [using environment variables](using-environment-variables) in Test Scenarios.
