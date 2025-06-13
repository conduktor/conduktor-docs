---
title: Kafka brokers
description: Manage Kafka resources in Conduktor
---

In <GlossaryTerm>Console</GlossaryTerm>, the **Brokers** page provides the broker list and information about the current state of your Kafka <GlossaryTerm>cluster</GlossaryTerm>, including:

- total number of brokers
- controller status (shows whether the selected broker is the controller or not)
- the version of your Kafka Cluster
- whether all brokers are configured the same or not (yes/no)

### Brokers tab

This is the default view that shows a key metrics graph and a table listing all your brokers. You can sort the view or search for a specific broker.

Click on a broker in the table to see its details:

- Hostname path
- Number of partitions
- Number of replicas
- Number of URPs (Under-Replicated Partitions)
- Configuration tab - search and view the list properties/values. Click **Raw view** to view or copy the raw broker data.
- Logs tab - view topics, partitions, offset lag and more
- Graphs tab - see disk usage and partition count graphs

### Graphs tab

This tab lets you visualize the current and past state of your Kafka clusters on metrics like:

- Produce and consume rate
- Disk usage
- Total partition count
- Offline, under replicated and under min ISR partition count

Each graph can be adjusted to show data for the past 24 hours, or one/seven/thirty day periods.

You can get notified of changes in any of these metrics as each graph can alerts set up.

To add an alert, click the **alert icon**. A side panel will open, allowing you to set parameters configure the triggers for your alert.

### Alerts tab

Manage existing and create new alerts for the selected broker.
