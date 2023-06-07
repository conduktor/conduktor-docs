---
sidebar_position: 1
title: Debug Conduktor Platform
description: How to debug Conduktor Platform
---
# Debug Conduktor Platform

Conduktor Platform Docker image runs on Ubuntu Linux.   
It runs multiple services in a single Docker container.    
These services are supervised by [supervisord](http://supervisord.org/).    

To troubleshoot the Platform, we suggest you to go through the following steps.

First, verify that the Platform is up and running.   
Second, use our "**Platform Diagnostic**" tool to get an automatic diagnostic report about the Platform and its components.   
Third, manually debug Conduktor Platform.    
And finally, consult the logs and send them to our support team if necessary.    

Let's now see in details each step.

## 1. Verify that the Platform is up and running

### From Docker

For this example, we'll use [Conduktor's example-local](https://github.com/conduktor/conduktor-platform/tree/main/example-local).

First step, verify that all the components are running.

```sh
mitch@m1-mbp example-local % docker-compose ps
NAME                                 COMMAND                  SERVICE              STATUS              PORTS
example-local-conduktor-platform-1   "/opt/conduktor/scri…"   conduktor-platform   running (healthy)   0.0.0.0:8080->8080/tcp
example-local-kafka-1                "/opt/conduktor/scri…"   kafka                running             0.0.0.0:9092-9093->9092-9093/tcp, 0.0.0.0:9101->9101/tcp, 9999/tcp
example-local-schema-registry-1      "/etc/confluent/dock…"   schema-registry      running             0.0.0.0:8081->8081/tcp
example-local-zookeeper-1            "/docker-entrypoint.…"   zookeeper            running             2888/tcp, 3888/tcp, 0.0.0.0:2181->2181/tcp, 8080/tcp
```

If you are using an external Kafka installation, you will only need to verify that the `conduktor-platform` container is showing `healthy` as the `STATUS`.

If anything is not showing or showing "exited" as the status, a good first step is to check the `docker logs` output with `docker logs ${CONDUKTOR_PLATFORM_CONTAINER_NAME}`, for example in the example-local docker it would be `docker logs example-local-conduktor-platform-1`. These logs can be saved to a file with `docker logs example-local-conduktor-platform-1 >& docker-logs-output.txt`.

### From Kubernetes
Kubernetes support have been introduced in version `0.3.0`
```sh
mitch@m1-mbp example-local % kubectl get pod -n <platform-namespace>
NAME                                         READY   STATUS    RESTARTS   AGE
platform-75d45ff86c-dlwb5                    1/1     Running   0          14d
```

Pod status is available in the "STATUS" column. Here the pod is running.

## 2. Debug with the "Platform Diagnostic" tool

:::info
Platform diagnostic is a tool that allow you to extract all the relevant log from conduktor platform in order to give all the necessary information to our support team to investigate your issue
:::

### Installation

> **Note** :  available only for Linux, Mac and WSL2 for now.
> if you need another support, make us a request



- For Conduktor Platform version >= **1.15.0**    

[M1 version](https://releases.conduktor.io/platform-diagnostic-m1_0-3-0)   
[x86 version](https://releases.conduktor.io/platform-diagnostic-amd_0-3-0)

- For Conduktor Platform version >= **1.10.0**

[ARM version](https://releases.conduktor.io/platform-diagnostic-arm_0-2-0)   
[x86 version](https://releases.conduktor.io/platform-diagnostic-amd_0-2-0)

- For Conduktor Platform version <= **1.9.1**

[ARM version](https://releases.conduktor.io/platform-diagnostic-arm_0-1-0)
[x86 version](https://releases.conduktor.io/platform-diagnostic-amd_0-1-0)

### Usage

First, allow the execution of the downloaded tool:
```sh
chmod +x platform-diagnostic-amd_0-3-0
```

To display the usage information, execute the following command:

```bash
./platform-diagnostic -h
```

The Platform Diagnostic tool supports:
 - [The Docker](#docker) version of the Platform
 - [The Kubernetes](#kubernetes) version of the Platform

#### Docker

For the Docker version, execute this tool on the same machine where the Conduktor platform is running.

```sh
./platform-diagnostic-amd_0-3-0 run docker
```

#### Kubernetes

For the Kubernetes version, execute this tool on a machine that has access to the cluster. Make sure to select the correct Kubernetes context.

```sh
# Execute the binary in a shell
./platform-diagnostic-amd_0-3-0 run kubernetes --namespace=<namespace_name> --pod-name=<platform-foo-bar>
```

#### Expected output

When executing the tool, the output should resemble the following, with slight variations between the Kubernetes and Docker versions:

```
Welcome to Conduktor Platform Diagnostic⚕️ !
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⠟⢻⡇⠀⠀⠀⠀⣠⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⡿⠋⠀⢸⣧⣤⣀⡀⠺⢿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡿⠀⠀⠀⢸⣿⣿⣿⣿⣆⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠇⠀⠀⢀⣼⣿⣿⣿⣿⣿⣷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⡿⠀⠀⠴⠿⣿⣿⣦⣄⣠⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⡇⠀⠀⠀⠀⠀⠈⠉⠉⠛⠛⠿⢿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⢿⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣷⣤⣀⠀⠀⠀⠀⠐⣿⣿⣷⣦⣤⣀⣤⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠚⠛⠛⠛⠛⠛⠛⠂⠀⠀⠀⠘⢿⣿⣿⠋⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣻⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⢦⣤⣀⡀⠀⠀⢀⣤⣾⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣾⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

All rights reserved to Conduktor Inc. https://www.conduktor.io
ToS : https://www.conduktor.io/terms-of-service
Privacy Policy : https://www.conduktor.io/privacy-policy

[18:38:19] 🤖 Diagnostic starting...
[18:38:19] ✅ Success - Init diagnostic
[18:38:19] ✅ Success - Export host system informations
[18:38:19] ✅ Success - Export docker version
[18:38:19] ✅ Success - Export platfom health status
[18:38:19] ✅ Success - Export user licence
[18:38:19] ✅ Success - Export platform versions
[18:38:19] ✅ Success - Export environment variables
[18:38:19] ✅ Success - Export services information
[18:38:20] ✅ Success - Export logs
[18:38:20] ✅ Success - Export platform global configuration
[18:38:20] ✅ Success - Sanitize configuration

[18:38:20] 🚀 Success! A tarball with all the diagnostic files has been created at: /home/you/filename
[18:38:20] 📌 Send this archive to 👉 support@conduktor.io 👈 with a description of your issue 👆
```

finally, you can get the archive created and send it to `support@conduktor.io` with a description of the issue you are facing

## 3. Manually debug Conduktor Platform

### Check services within the Conduktor-platform container

First we will need to invoke a shell within the Conduktor-platform container. This is a short-cut to do this:

```sh
docker exec -it `docker ps | grep conduktor-platform | awk '{ print $1 }'` /bin/bash
```

The other option is to `docker exec -it ${CONTAINER_ID} /bin/bash`

From within the container the first step should be verify that all expected services are started. Conduktor platform uses supervisord inside of the container to ensure various services are started:

```sh
root@15012271cc24:/# supervisorctl
admin-portal                     RUNNING   pid 32, uptime 0:49:39
alertmanager                     RUNNING   pid 43, uptime 0:49:39
authenticator                    RUNNING   pid 29, uptime 0:49:39
console                          RUNNING   pid 33, uptime 0:49:39
cortex                           RUNNING   pid 47, uptime 0:49:39
crond                            EXITED    Nov 07 07:33 PM
data_masking                     FATAL     Exited too quickly (process log may have details)
governance_api                   FATAL     Exited too quickly (process log may have details)
kafka_lag_exporter               RUNNING   pid 71, uptime 0:49:39
kafka_monitoring_api             RUNNING   pid 31, uptime 0:49:39
platform_api                     RUNNING   pid 39, uptime 0:49:39
postgresql                       RUNNING   pid 28, uptime 0:49:39
prometheus                       RUNNING   pid 41, uptime 0:49:39
proxy                            RUNNING   pid 72, uptime 0:49:39
testing                          RUNNING   pid 35, uptime 0:49:39
testing-agent                    RUNNING   pid 38, uptime 0:49:39
topic_scanner                    RUNNING   pid 69, uptime 0:49:39
supervisor>
```

In the above example you can see that `data_masking` and `governance_api` failed to start. This tells us what log files will be most important to look into.  

## 4. Get the logs and send them to support

Logs are kept in `/var/conduktor/log`

For example

```sh
 cat /var/conduktor/log/data_masking-stdout---supervisor-gm63c0c8.log
```

You can find a `stdout` file for each service.  
Some services will also have a `stderr` file.   
The last part of the file name, `---supervisor-gm63c0c8`, is just a random run ID.

If you prefer to simply bring all the logs to your local machine, you can also run `docker-compose cp conduktor-platform:/var/conduktor/log .`
This will bring all the Conduktor logs to your $PWD in a directory call log.

These logs should contain the necessary information to contact our support team at `support@conduktor.io` or self troubleshoot the issue.
