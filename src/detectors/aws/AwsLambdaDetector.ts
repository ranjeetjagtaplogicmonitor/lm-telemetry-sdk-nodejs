import {
	Detector,
	Resource,
	ResourceDetectionConfig,
} from '@opentelemetry/resources';
import {
	SemanticResourceAttributes,
	CloudPlatformValues,
} from '@opentelemetry/semantic-conventions';
import { awsLambdaDetector as otelAWSLambdaDetector } from '@opentelemetry/resource-detector-aws';
import { LambdaClient, GetFunctionCommand } from '@aws-sdk/client-lambda';
/**
 * The AwsLambdaDetector can be used to detect if a process is running in AWS Lambda
 * and return a {@link Resource} populated with data about the environment.
 * Returns an empty Resource if detection fails.
 */
export class AwsLambdaDetector implements Detector {
	private context;

	constructor(context?: {}) {
		this.context = context;
	}

	async detect(_config?: ResourceDetectionConfig): Promise<Resource> {
		let otelResource;
		try {
			otelResource = await otelAWSLambdaDetector.detect();
		} catch (e) {
			console.log(e);
			return Resource.empty();
		}

		if (Object.keys(otelResource).length === 0) {
			return Resource.empty();
		}
		const cloudPlatformAttribute = {
			[SemanticResourceAttributes.CLOUD_PLATFORM]:
				CloudPlatformValues.AWS_LAMBDA,
		};

		const resourceWithCloudPlatform = new Resource(cloudPlatformAttribute);
		const mergedResource1 = otelResource.merge(resourceWithCloudPlatform);

		if (this.context) {
			try {
				console.log('Trying to retrieve invokedFunctionArn from context');
				const additionalAttributes = {
					[SemanticResourceAttributes.FAAS_ID]: (this.context as any)
						.invokedFunctionArn,
				};
				const resourceWithAdditionalAttributes = new Resource(
					additionalAttributes,
				);

				const mergedResource = mergedResource1.merge(
					resourceWithAdditionalAttributes,
				);

				return mergedResource;
			} catch (e) {
				console.log('invokedFunctionArn key not found in context', e);
			}
		}

		try {
			console.log('Making API call for AWS Lambda Resource Detection');
			const params = {
				FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME /* required */,
			};
			const lambda = new LambdaClient({});
			const command = new GetFunctionCommand(params);
			const response = await lambda.send(command);

			if (response.Configuration) {
				const additionalAttributes = {
					[SemanticResourceAttributes.FAAS_ID]:
						response.Configuration.FunctionArn!,
				};

				const resourceWithAdditionalAttributes = new Resource(
					additionalAttributes,
				);

				const mergedResource = mergedResource1.merge(
					resourceWithAdditionalAttributes,
				);

				return mergedResource;
			}
		} catch (e) {
			console.log(e);
			return Resource.empty();
		}
		return Resource.empty();
	}
}

export const awsLambdaDetector = new AwsLambdaDetector();
export const AwsLambdaDetectorWithContext = AwsLambdaDetector;
