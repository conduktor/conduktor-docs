---
sidebar_position: 5
title: Kubernetes
description: The below guide details how to deploy kubernetes resources to run Conduktor Platform.
---

> This is still experimental, do not hesitate to help us refining our documentation.

PLEASE DO NOT USE, THIS IS UNTESTED.

If you have some feedback about it, please contact us.


# OpenShift


```
kind: Deployment
apiVersion: apps/v1
metadata:
  name: conduktor-platform
  labels:
    app: conduktor-platform
spec:
  replicas: 1
  selector:
    matchLabels:
      app: conduktor-platform
  template:
    metadata:
      labels:
        app: conduktor-platform
        deployment: conduktor-platform
   spec:
      volumes:
        - name: conduktor
          persistentVolumeClaim:
            claimName: conduktor       
        - name: nginx
          persistentVolumeClaim:
            claimName: nginx
        - name: config
          configMap:
            name: example
            defaultMode: 420
      containers:
        - name: conduktor-platform
          env:
            - name: CDK_IN_CONF_FILE
              value: /opt/conduktor/custom-config/platform-config.yaml
          image: conduktor/conduktor-platform:latest
          ports:
            - containerPort: 8080
              protocol: TCP         
          resources:
            limits:
              cpu: 1
              memory: 4Gi
            requests:
              cpu: 1
              memory: 4Gi   
          volumeMounts:
            - name: conduktor
              mountPath: /var/conduktor
            - name: config
              mountPath: /opt/conduktor/custom-config
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          imagePullPolicy: Always
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      securityContext:
        readOnlyRootFilesystem: false
        runAsNonRoot: false
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
  revisionHistoryLimit: 10
  progressDeadlineSeconds: 600
```
