---
sidebar_position: 8
title: CI/CD Automation
description: Automate testing via the CI Agent.
---

# CI/CD Automation

Conduktor Testing supports automated execution of Test Scenarios via the CI Agent. This process enables you to run a [Test Suite](building-tests/test-suites) from within your build pipeline with ease.

**Why automate testing in your CI environment?**

- Reduce manual efforts when tests need to be run repetitively
- Ensure builds are stable before they are released
- Helps compute test results and identify regressions

Jump to
 - [Configuring the CI Agent](#configuring-the-ci-agent)
 - [Creating a Run Configuration](#create-a-run-configuration)
 - [Generating the CI Script](#generating-the-ci-script)
    - [Github Actions Example](#running-on-github-actions)
    - [Circle CI Example](#running-on-circle-ci)
    - [Gitlab Example](#running-on-gitlab-cicd)
    - [Jenkins Example](#running-on-jenkins)

## Configuring the CI Agent

The pre-requisite for executing tests in your CI environment is configuring the CI Agent.

A single agent token can be used in multiple CI process in parallel. However for audit purposes, we recommend creating new agents when the scope or access changes.

This can be obtained from the **Agents** tab by selecting **Create an agent.**

![](<../assets/image (8) (1).png>)

Select **CI Agent** and click **Create.**

### **Download the Token**

**Download** the newly generated token and store it somewhere secure.&#x20;

:::danger
Careful, as **you will only be shown the token once!** So make sure you download it and store it somewhere secure
:::

![](<../assets/image (34) (1).png>)

### Example Github Action

Select the **Github Action** tab to see an example command for executing test scenarios in your CI/CD environment.

Note you can use this template, but you will need to replace the **'REFERENCE'** dependency.

To obtain the reference, see creating a [Run Configuraiton](#create-a-run-configuration).

![](<../assets/conduktor-testing-gh-action.png>)

## Create a Run Configuration

You must create a Run Configuration that can be referenced for CI execution. 

Run configurations are created from [Test Suites](building-tests/test-suites).

With a Test Suite open, navigate to the **Automation** tab to create a Run Configuration.

![](<../assets/testing-run-config.png>)

Select **+ New Run Configuration** and configure the parameters for your CI tests. 
 - Give your Run Configuration a suitable **Name** and **Description**
 - If using environments, select the **Environment**
 - Select the **Scenarios** that you wish to be part of your Run Configuration
 - If necessary, configure the [Data Security](../miscellaneous/data-security) settings

![](<../assets/testing-run-config-2.png>)

**Save** the configuration to create the Run Configuration.

## Generating the CI Script

Once you have saved a [Run Configuration](#create-a-run-configuration), Conduktor will help generate a custom script for integrating in popular CI tools.

Select the **Integrate with CI/CD** button from within the **Automation** screen of your Test Suite.

![](<../assets/testing-ci-config.png>)

Add the **Token** from when you created a [CI Agent](#configuring-the-ci-agent) earlier, and select your **Run Configuration** from the prior step. 

Upon clicking **Get custom configuration**, you will be presented with templates for running your tests via Github Actions, Docker, Circle CI, Gitlab and Jenkins.

![](<../assets/testing-ci-script.png>)

Note that Conduktor Testing **integrates with any CI/CD platform**. If we do not provide an example, please [contact us](https://www.conduktor.io/contact/support) so we can help you. 

### Running on Github Actions

Below shows an example Github action, utilizing the CI agent to automate execution of tests.

Note the parameters:

- **Container image**: `ghcr.io/conduktor/testing-agent-ci:latest`
- **Token**: Replace with your [CI token](#configuring-the-ci-agent)
- **Reference:** The [Run Configuration](#create-a-run-configuration) reference

```yaml
name: Example Github Action
on:
  push:
    branches:
      - main
jobs:
  tests:
    runs-on: ubuntu-latest
    container:
      image: ghcr.io/conduktor/testing-agent-ci:latest
    steps:
      - name: My Awesome Test Suite
        env:
          TOKEN: YWIzZWFhNWYtNDkzOC00NWIxLThmMGEtNGFiZjNlNDJjYjY1bXktZmlyc3QtYWdlbnQ
          REFERENCE: fZTEYJeZqK3eW72rqyt9Z4
        run: /opt/docker/bin/runner-ci-build
```

### Running on Circle CI

Below is an example of a Circle CI workflow, using the CI agent to automate test execution.

Note the parameters:

- **Container image**: `ghcr.io/conduktor/testing-agent-ci:latest`
- **Token**: Replace with your [CI token](#configuring-the-ci-agent)
- **Reference:** The [Run Configuration](#create-a-run-configuration) reference

```yaml
version: 2.1

jobs:
  conduktor-testing:
    docker:
      - image: ghcr.io/conduktor/testing-agent-ci:latest
    steps:
      - run:
          name: Run Testing Scenario
          command: '/opt/docker/bin/runner-ci-build'
          environment:
            TOKEN: YWIzZWFhNWYtNDkzOC00NWIxLThmMGEtNGFiZjNlNDJjYjY1bXktZmlyc3QtYWdlbnQ
            REFERENCE: fZTEYJeZqK3eW72rqyt9Z4

workflows:
  conduktor-testing-workflow:
    jobs:
      - conduktor-testing
```

### Running on Gitlab CI/CD

Below is an example of a Gitlab CI workflow, using the CI agent to automate test execution.

Note the parameters:

- **Container image**: `ghcr.io/conduktor/testing-agent-ci:latest`
- **Token**: Replace with your [CI token](#configuring-the-ci-agent)
- **Reference:** The [Run Configuration](#create-a-run-configuration) reference

```yaml
stages:
  - test

conduktor-testing-job:
  stage: test
  image:
    name: ghcr.io/conduktor/testing-agent-ci:latest
    entrypoint: ['']
  variables:
    TOKEN: YWIzZWFhNWYtNDkzOC00NWIxLThmMGEtNGFiZjNlNDJjYjY1bXktZmlyc3QtYWdlbnQ
    REFERENCE: fZTEYJeZqK3eW72rqyt9Z4

script: /opt/docker/bin/runner-ci-build
```

### Running on Jenkins

Below is an example of a Jenkins pipeline, using the CI agent to automate test execution.

_Prerequisite: Your Jenkins agent should have access to docker daemon._

Note the parameters:

- **Container image**: `ghcr.io/conduktor/testing-agent-ci:latest`
- **Token**: Replace with your [CI token](#configuring-the-ci-agent)
- **Reference:** The [Run Configuration](#create-a-run-configuration) reference

```hoon
pipeline {
  agent any
  stages {
      stage('my-test-suite') {
          steps {
              sh '''
              docker run -e TOKEN="YWIzZWFhNWYtNDkzOC00NWIxLThmMGEtNGFiZjNlNDJjYjY1bXktZmlyc3QtYWdlbnQ" -e REFERENCE="fZTEYJeZqK3eW72rqyt9Z4" ghcr.io/conduktor/testing-agent-ci:latest
              '''
          }
      }
  }
}
```
