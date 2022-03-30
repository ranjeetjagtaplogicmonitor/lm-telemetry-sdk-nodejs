[![codecov](https://codecov.io/gh/logicmonitor/lm-telemetry-sdk-nodejs/branch/main/graph/badge.svg?token=NCXEJLVNWH)](https://codecov.io/gh/logicmonitor/lm-telemetry-sdk-nodejs)

_NOTE: This is in private beta._
# lm-telemetry-sdk-nodejs
LogicMonitor Telemetry SDK for node.js

## Description

This SDK currently detects Resources on the platforms listed below in the table.

## Prerequisites

This package is published on GitHub Packages NPM registry, you need to follow certain steps to fetch/install this. Please follow these steps to setup your project to use this package.

### Set a GitHub Personal Access Token to get lm-telemetry-sdk-nodejs from GitHub Package registry
- Generate a personal access token for your github account with `repo` and `read:packages` scope. [Follow these steps](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- Set your generated token as `GH_PAT` environment variable

### Modify your .npmrc file
- If you have not created `.npmrc` in your project, just create a blank file named `.npmrc` in the root of your project.
- Add the following in `.npmrc`
```
@logicmonitor:registry=https://npm.pkg.github.com/logicmonitor
//npm.pkg.github.com/:_authToken=${GH_PAT}
```
## Usage Examples:

- [Auto Instrumentation Example](https://github.com/logicmonitor/lm-telemetry-sdk-nodejs/tree/main/examples/auto-instrumentation)
- [Manual Instrumentation Example](https://github.com/logicmonitor/lm-telemetry-sdk-nodejs/tree/main/examples/manual-instrumentation)

### Resource Detector env config

Environment variable `LM_RESOURCE_DETECTOR` can be set to one of the following values, to set appropriate resource detector if you want to specify explicitly.

| Value                     | Description|
|---------------------------|-------------------------------------|
| `aws_ec2`                 | AWS Elastic Compute Cloud |
| `aws_ecs`                 | AWS Elastic Container Service |
| `aws_lambda`              | AWS Lambda |
| `gcp_compute_engine`      | Google Cloud Compute Engine (GCE) |
| `gcp_kubernetes_engine`   | Google Kubernetes Engine (GKE) |
| `gcp_cloud_functions`     | Google Cloud Functions (GCF) |
| `azure_vm`								| Azure VM |
| `azure_functions`         | Azure Functions |


