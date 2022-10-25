---
sidebar_position: 3
---

# Set Variable Task

The Set Variable task enables you to assign values to a local variable for use in your [Test Scenario](../test-scenarios).&#x20;

You can define a value explicitly, or reference data from a chained task using the [Task Ports](task-ports).&#x20;

:::info
Unlike [environment](../../environments/) variables, which can be used globally across any scenario, local variables are only available within the context of the scenario they are set.
:::

**Quick links:**

- [Create a Set Variable task](set-variable-task#create-a-set-variable-task)
- [Accessing a local variable](set-variable-task#accessing-a-local-variable)
- [Accessing data from a previous task](set-variable-task#accessing-data-from-a-previous-task)

## Create a Set Variable task

When inside the visual editor for a new scenario, select the **Scenario Start** button and select **Set Variables** from the dropdown menu.

![](<../../../assets/image (154).png>)

Enter the variable value in the **Value** input, and add your variable name in the **Assign to** input.

:::info
Note you can switch between the different [Custom Inputs](../../custom-inputs) for assigning values to variables using different methods. For example, via a JavaScript snippet.&#x20;
:::

![](<../../../assets/image (4) (1).png>)

## **Accessing a local variable**

Once you have configured a local variable, it's possible to access it in subsequent tasks.

Depending \*\*\*\* on which [custom input](../../custom-inputs) you are using, you should access local variables differently.

| Attribute      | How to access: Field selection (JQ) | How to access: JavaScript   |
| -------------- | ----------------------------------- | --------------------------- |
| Local variable | .variables.productId                | context.variables.productId |

Chain a producer task from the `VARIABLES` port of the previously configured task.&#x20;

![](<../../../assets/image (120).png>)

Navigate to the **Data** tab of your Producer task.

To utilize the variable as the message value, use the **Template (mustache)** input type.

![](<../../../assets/image (117).png>)

Click into the Value field, and use the helper to select from a list of available variables.&#x20;

![](<../../../assets/image (116).png>)

## Accessing data from a previous task

it's possible to set local variables from data relevant to the context of a previous task. You can do this by utilising the **`triggeredBy`** property.

For example, if you have a Set Variable task that's chained to the **`ON RECORD`** port of a Consumer task, you can access the record key and value.

| Attribute    | How to access: Field selection (JQ) | How to access: JavaScript            |
| ------------ | ----------------------------------- | ------------------------------------ |
| Record Key   | .triggeredBy\[0].record.key         | context.triggeredBy\[0].record.key   |
| Record Value | .triggeredBy\[0].record.value       | context.triggeredBy\[0].record.value |

**Example:** Setting a variable from a JSON message value via a Consumer task

_Note you should use the Field Selection (JQ) \*\*\*\*_ [_custom input_](../../custom-inputs) _to access the data_

![](<../../../assets/image (47).png>)

If you have more than one origin for a task, you can use Field Selection (JQ) or Javascript advanced filtering options to pick the right one.&#x20;

Soon, we will provide more documentation on that (and we'll try to simplify this part).\
