---
sidebar_position: 1
title: Overview
description: Learn how to get started with Console
---

# Console

## Overview

The Conduktor Console is a powerful UI for Apache Kafka. The Console equips users with functionality to support many tasks pertaining to Kafka. The Console’s capabilities are divided into three main areas:
 - [Exploration](#exploration)
 - [Operations](#operations)
 - [Troubleshooting](#troubleshooting)

![Conosle](/img/console/console.webp)

## Exploration

The Conduktor Console presents all of your topics, schemas, consumer groups, ACLs and connectors in an easy-to-understand and centralized UI. 

Key features relating to exploration are:
 - Listing all your Kafka resources (topics, schemas, consumer groups, ACLs, connectors)
 - Deep-diving into topics to find messages via:
    - Time, Offset and Partition based filters
    - JavaScript filters
    - Simple filters (contains, does not contain, equals, not equals etc.)
    - Support for Avro, Protobuf, JSON
 - View and update topic configurations
 - View schemas and version history
    - Supporting all Confluent-like schema resgistries and AWS Glue
 - View consumer groups and topic-partition lag
 - View connectors and associated tasks
 - View ACLs and service accounts
 - View broker information

## Operations

Key features relating to Kafka operations are:
 - Create, Edit, Empty and Delete topics
 - Produce data to a topic
    - With randomization and 'flow' mode (stream of messages)
 - Create, update and delete schemas
 - Compare schema versions
 - Reset consumer group offsets
    - Strategies: earliest, latest, specific offset, shift by, datetime
 - Create, pause, restart and delete Kafka connect instances
 - Kafka connector auto-restart
 - Reprocess messages (DLQ)
 - Manage ACLs
 - Manage Service Accounts
 - Manage Gateway interceptors
 - Infrastructure monitoring and alerting
 - Application monitoring and alerting

## Troubleshooting

Key features relation to troubleshooting Kafka include:
 - Live consumuption of messages in a topic (while applying filters)
 - Surfacing errors relating to failed Connect tasks
 - Monitoring and alerting on consumer group lag and other Kafka metrics
 - Checking the compatibility of schema changes
 - Exporting data for deeper analysis
 - Chaos engineering to test application resilience

 

