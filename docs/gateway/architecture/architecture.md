---
title: Architecture
description: TBD
---

# Gateway Architecture

# Project layout:

```
conduktor-gateway    
│
└── interceptor-framework - a minimal template for creating interceptors
│
└── logger-interceptor - an example interceptor project 
│
└── gateway-core - the main gateway project 
│   │
│   └── config - sample configuration files
│   │
│   └── src/main/java - the code
│   │
│   └── src/test/java - unit tests
│   
└── gateway-test - integration testing
│   │
│   └── config - configuration files for test cases
│   │
│   └── src/test/java - integration tests
│   │
│   └── src/test/resources - docker setup for integration tests 
```
