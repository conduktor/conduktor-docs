---
sidebar_position: 3
title: Reprocess Messages
description: Conduktor Platform can help you reprocess a message within a topic. This could be used for reprocessing a message from an existing DLQ (Dead Letter Queue), or for pushing any observed message into another topic.
---

# Reprocess Messages

Conduktor Platform can help you reprocess a message within a topic. This could be used for reprocessing a message from an existing DLQ (Dead Letter Queue), or for pushing any observed message into another topic.

## Find the message

Identify a message that you wish to reprocess by finding it from within the topic view.

Select the message, and click the **reprocess message** button from within the slideout component.

![console-reprocess.png](/img/console/console-reprocess.png)

## Choose target topic

On the subsequent screen, select the **target topic** that you wish to publish the message.

![console-reprocess.png](/img/console/console-reprocess-2.png)

## Edit and process the message

You will be redirected to the producer view with the message **Key**, **Value** and any **Headers** auto-populated from the original message. Optionally, edit the message content and then select produce to reprocess the message.

![console-reprocess.png](/img/console/console-reprocess-3.png)
