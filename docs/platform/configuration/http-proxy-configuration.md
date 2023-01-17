---
sidebar_position: 8
title: HTTP Proxy Configuration
description: Specify proxy settings that Conduktor Platform should use to access the Internet. The HTTP proxy works for both HTTP and HTTPS connections.
---

# HTTP Proxy Configuration
Specify proxy settings that Conduktor Platform should use to access the Internet. The HTTP proxy works for both HTTP and HTTPS connections.

There are 5 properties you can set to specify the proxy that will be used by the http protocol handler:

`CDK_HTTP_PROXY_HOST`: the host name of the proxy server  
`CDK_HTTP_PROXY_PORT`: the port number, the default value being 80.  
`CDK_HTTP_NON_PROXY_HOSTS`: a list of hosts that should be reached directly, bypassing the proxy. This is a list of patterns separated by '|'. The patterns may start or end with a '*' for wildcards. Any host matching one of these patterns will be reached through a direct connection instead of through a proxy.  
`CDK_HTTP_PROXY_USERNAME`: the proxy username  
`CDK_HTTP_PROXY_PASSWORD`: the proxy password

## Example
```yaml
version: '3.8'
services:
  conduktor-platform:
    image: conduktor/conduktor-platform:latest
    ports:
      - 8080:8080
    environment:
      CDK_HTTP_PROXY_HOST: "proxy.mydomain.com"
      CDK_HTTP_PROXY_PORT: 8000
      CDK_HTTP_NON_PROXY_HOSTS: "*.mydomain.com"
```
