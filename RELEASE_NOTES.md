# Release notes: lm-telemetry-sdk-nodejs

## Unreleased

 ### Resource detection for following services:
- #### AWS:
		 -  EC2
		 - Lambda
- #### GCP
		 - Cloud Function
		 - Compute Instances
		 - GKE
- #### Azure
		 - Azure VM
		 - Azure Functions
			 
By default, the package loops through all the available detectors to detect the resources automatically but you can limit or choose to run a particular detector by specifying an environment variable:

`LM_RESOURCE_DETECTOR`

Use these values for the desired detector:

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
