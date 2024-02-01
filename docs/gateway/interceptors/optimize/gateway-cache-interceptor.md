---
version: 2.5.0
title: Caching
description: Cache requests to lower your costs and latency
parent: optimize
license: enterprise
---

## Introduction

Cache Interceptor is designed to improve the performance of record retrieval in a Kafka cluster by caching records.

It intercepts produce and fetch requests, caching produced records and serving fetched records from the cache if
available.

## Benefits

Cache Interceptor offers several benefits:

- Improved Performance:
  By serving fetched records from the cache, subsequent fetch requests can be served faster, reducing the overall
  latency and improving the response time for clients.
- Reduced Load on Kafka Cluster:
  With the cache interceptor in place, the Kafka cluster experiences reduced load during fetch requests since a portion
  of the requests can be satisfied from the cache directly, reducing the number of requests hitting the cluster.
- Enhanced Scalability:
  The cache interceptor provides an additional layer of scalability by distributing the workload between the cache and
  the Kafka cluster.
  It can handle a higher volume of fetch requests without overwhelming the Kafka cluster.

## Configuration

| config      | type                         | default | description                                                                                                                       |
|:------------|------------------------------|:--------|:----------------------------------------------------------------------------------------------------------------------------------|
| topic       | String                       | `.*`    | Topic regex, topic that match this regex will have the interceptor applied. If no value is set, it will be applied to all topics. |
| cacheConfig | [Cache Config](#cacheConfig) |         | Configuration for cache.                                                                                                          |

### CacheConfig

| config        | type                             | description                        |
|:--------------|----------------------------------|:-----------------------------------|
| type          | enum (IN_MEMORY, ROCKSDB)        | Default: IN_MEMORY.                |
| rocksdbConfig | [Rocksdb Config](#rocksdbConfig) | Configuration for rocksdb cache.   |
| inMemConfig   | [In Mem Config](#inMemConfig)    | Configuration for im-memory cache. |

### RocksdbConfig

| config    | type   | description                                 |
|:----------|--------|:--------------------------------------------|
| dbPath    | String | Path to RocksDB database                    |
| cacheSize | int    | RocksDB cache size in bytes, default: 100MB |

### InMemConfig

| config       | type | description                                      |
|:-------------|------|:-------------------------------------------------|
| cacheSize    | int  | In-memory cache size.                            |
| expireTimeMs | long | In-memory cache expiration time in milliseconds. |

## Example

```json
{
  "name": "myCacheInterceptor",
  "pluginClass": "io.conduktor.gateway.interceptor.CacheInterceptorPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "cacheConfig": {
      "type": "ROCKSDB",
      "rocksdbConfig": {
        "dbPath": "/caching_storage",
        "cacheSize": 104857600
      }
    }
  }
}
```