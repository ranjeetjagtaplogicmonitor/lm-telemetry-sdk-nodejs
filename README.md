[![codecov](https://codecov.io/gh/logicmonitor/lm-telemetry-sdk-nodejs/branch/main/graph/badge.svg?token=NCXEJLVNWH)](https://codecov.io/gh/logicmonitor/lm-telemetry-sdk-nodejs)

_NOTE: This is in private beta._
# lm-telemetry-sdk-nodejs
LogicMonitor Telemetry SDK for node.js

## Description

This SDK currently detects Resources on the platforms listed below in the table.
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


