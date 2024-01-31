---
sidebar_position: 5
title: Topic Partitions
description: Conduktor Platform can help you to send messages into your topic. It's a useful feature for testing something without having to write a complete application.
---
The Topic Partitions tab displays all the partition information associated to the topic.  
You can switch from the default "Per partition" view to the "Per broker" view.  

The **Per partition** view presents the data available for each partition:  
- Total number of records (estimated using EndOffset - BeginOffset)
- Partition Size
- Begin and End Offsets
- Broker Ids of the Partition Leader (green) and Followers (grey)  
![Image](img/per-partition.png)

The **Per broker** view pivots the data to show for each broker:  
- Partitions where the broker is Leader
- Partitions where the broker is Follower  
![Image](img/per-broker.png)

## Operations
### Empty Partition
Empty Partition removes the Kafka records from the selected partition. If you need to delete all records from all partitions, use the Empty Topic button from the Configuration page instead. 
