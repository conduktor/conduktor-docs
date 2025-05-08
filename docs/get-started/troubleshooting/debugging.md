---
sidebar_position: 2
title: Debugging
description: How to debug Conduktor
---
# Debug Conduktor

Conduktor Console Docker image runs on Ubuntu Linux. It runs multiple services in a single Docker container. These services are supervised by [supervisord](http://supervisord.org/).    

To troubleshoot the Console, we suggest you go through the following steps.

First, verify that the Console is up and running.    
Second, manually debug Conduktor Console.    
And finally, consult the logs and send them to our support team if necessary.    

Let's now see in detail each step.

## Verify that Conduktor is up and running

### From Docker

First, verify that all the components are running.

```bash title="Get containers status"
docker ps
```

```txt title="Output"
NAME                   IMAGE                                       COMMAND                  SERVICE                CREATED          STATUS                    PORTS
conduktor-console      conduktor/conduktor-console:1.21.0          "/__cacert_entrypoin…"   conduktor-console      10 minutes ago   Up 9 minutes (healthy)    0.0.0.0:8080->8080/tcp
conduktor-monitoring   conduktor/conduktor-console-cortex:1.21.0   "/opt/conduktor/scri…"   conduktor-monitoring   10 minutes ago   Up 10 minutes (healthy)   0.0.0.0:9009-9010->9009-9010/tcp, 0.0.0.0:9090->9090/tcp
postgres               postgres:15.1                               "docker-entrypoint.s…"   postgres               10 minutes ago   Up 10 minutes             0.0.0.0:5432->5432/tcp
```

If you are using an external Kafka installation and external database, you will only need to verify that the `conduktor-console` container is showing `healthy` as the `STATUS`.

If Console is showing an "exited" status, you can check the docker logs by running the command (with the correct container name):

```bash title="Get container logs"
docker logs conduktor-console
```

You can save these logs in a file by doing:

```bash title="Store logs in a file"
docker logs conduktor-console >& docker-logs-output.txt
```

### From Kubernetes

In order to get the status of the Conduktor Console pod in Kubernetes, you can run the following command (with the correct namespace, if any):

```bash title="Get containers status"
kubectl get pod --namespace conduktor
```

```txt title="Output"
NAME                                         READY   STATUS    RESTARTS   AGE
console-instance-cortex-5d85d5cfb4-qcxhs   1/1     Running   0          2m4s
console-instance-747d5ffc7b-gcpkx          1/1     Running   0          2m4s
```

Pod status is available in the "STATUS" column. Console and Monitoring are running.

## Manually debug Conduktor Console

### Check services within the conduktor-console container

First, we will need to invoke a shell within the conduktor-console container. For that, you can use the following commands:

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="Based on container name" label="Based on container name">

```sh
docker exec -it conduktor-console bash
```

</TabItem>
<TabItem value="Based on container ID" label="Based on container ID">

```sh
docker exec -it fe4a5d1be98f bash
```

</TabItem>
</Tabs>

From within the container, you can verify that all expected services are started. Conduktor Console uses supervisord inside of the container to ensure various services are started:

```sh title="Check services status"
supervisorctl status
```

```txt title="Output"
console                          FATAL     Exited too quickly (process log may have details)
platform_api                     RUNNING   pid 39, uptime 0:49:39
proxy                            RUNNING   pid 33, uptime 0:49:39
```

In the example mentioned above, the console did not start successfully. This indicates that we need to look at the log files to investigate the issue further.

## Get the logs and send them to support

Logs are kept in `/var/conduktor/log`. You can see them using:

```sh title="List log files"
ls /var/conduktor/log/
```

```txt title="Output"
console-stdout---supervisor-umscgn8w.log       proxy                                   proxy-stdout---supervisor-2gim6er7.log  supervisord.log
platform_api-stdout---supervisor-cqvwnsqi.log  proxy-stderr---supervisor-8i0bjkaz.log  startup.log
```

The best here is to simply bring all the logs to your local machine (in PWD) by running:

```sh
docker compose cp conduktor-console:/var/conduktor/log .
```

Then send these logs to our support team via our [Support Portal](https://support.conduktor.io).