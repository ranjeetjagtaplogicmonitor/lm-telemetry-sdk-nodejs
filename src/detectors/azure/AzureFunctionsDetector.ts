import {
	Detector,
	Resource,
	ResourceDetectionConfig,
} from '@opentelemetry/resources';
import {
	SemanticResourceAttributes,
	CloudPlatformValues,
	CloudProviderValues,
} from '@opentelemetry/semantic-conventions';
/**
 * The AzureFunctionsDetector can be used to detect if a process is running in Azure Functions
 * and return a {@link Resource} populated with data about the environment.
 * Returns an empty Resource if detection fails.
 */
export class AzureFunctionsDetector implements Detector {
	private context;

	constructor(context?: {}) {
		this.context = context;
	}

	async detect(_config?: ResourceDetectionConfig): Promise<Resource> {
		if (!('FUNCTIONS_WORKER_DIRECTORY' in process.env)) {
			return Resource.empty();
		}

		if (!process.env.FUNCTIONS_WORKER_DIRECTORY?.includes('azure-functions')) {
			return Resource.empty();
		}

		const resource = new Resource({
			[SemanticResourceAttributes.CLOUD_PROVIDER]: CloudProviderValues.AZURE,
			[SemanticResourceAttributes.CLOUD_PLATFORM]:
				CloudPlatformValues.AZURE_FUNCTIONS,
		});
		if ('WEBSITE_DEPLOYMENT_ID' in process.env) {
			resource.attributes[SemanticResourceAttributes.FAAS_ID] =
				process.env.WEBSITE_DEPLOYMENT_ID!;
		}
		if (
			this.context &&
			'executionContext' in this.context &&
			'functionName' in (this.context as any).executionContext
		) {
			resource.attributes[SemanticResourceAttributes.FAAS_NAME] = (
				this.context as any
			).executionContext.functionName;
		}
		return resource;
	}
}

export const azureFunctionsDetector = new AzureFunctionsDetector();
export const AzureFunctionsDetectorWithContext = AzureFunctionsDetector;
