---
title: Topics Management
description: Managing topics with Conduktor Desktop
---

# Topics Management

<iframe width="560" height="315" src="https://www.youtube.com/embed/upRjuUs67S4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Columns Customization / Performances

### Comparing Topics with a Custom Column

Sometimes, you want to see a given configuration for all topics to compare them. Is the retention the same everywhere? What about the segment size? The minimum in-sync replicas? In an instant, you can get the answer by showing a given config in a dedicated column.

![](../../assets/screenshot-2020-09-19-at-21.52.57.png)

The field is automatically populated and auto-completes:

![](../../assets/screenshot-2020-09-19-at-21.56.16.png)

### Avoid long names and use Smart Groups

Conduktor has a feature called [Smart Groups](./smart-groups) to remove long names from the list and instead create distinct columns to work with.

![](../../assets/screenshot-2020-09-19-at-21.49.07.png)

## Exports Topics to file

![](../../assets/screenshot-2020-09-19-at-21.48.41.png)

- **CSV/JSON**: export what you see on the screen
- **Terraform**: export the topics with their configuration into a .tf using the provider [https://github.com/Mongey/terraform-provider-kafka](https://github.com/Mongey/terraform-provider-kafka) format
