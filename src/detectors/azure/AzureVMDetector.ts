import {
	Detector,
	Resource,
	ResourceDetectionConfig,
} from '@opentelemetry/resources';
import {
	CloudProviderValues,
	CloudPlatformValues,
	SemanticResourceAttributes,
} from '@opentelemetry/semantic-conventions';
import * as http from 'http';

class AzureVMDetector implements Detector {
	readonly AZURE_IDMS_ENDPOINT = '169.254.169.254';
	readonly AZURE_API_VERSION = '2021-02-01';
	readonly AZURE_INSTANCE_METADATA_PATH = `/metadata/instance?api-version=${this.AZURE_API_VERSION}`;

	async detect(_config?: ResourceDetectionConfig): Promise<Resource> {
		try {
			const metadata = await this._fetchMetadata();

			const instanceMetadata = JSON.parse(metadata);

			return new Resource({
				[SemanticResourceAttributes.CLOUD_PROVIDER]: CloudProviderValues.AZURE,
				[SemanticResourceAttributes.CLOUD_PLATFORM]:
					CloudPlatformValues.AZURE_VM,
				[SemanticResourceAttributes.CLOUD_REGION]:
					instanceMetadata.compute.location,
				[SemanticResourceAttributes.CLOUD_AVAILABILITY_ZONE]:
					instanceMetadata.compute.location,
				[SemanticResourceAttributes.HOST_ID]: instanceMetadata.compute.vmId,
				[SemanticResourceAttributes.HOST_NAME]: instanceMetadata.compute.name,
				'azure.vm.size': instanceMetadata.compute.vmSize,
				[SemanticResourceAttributes.CLOUD_ACCOUNT_ID]:
					instanceMetadata.compute.subscriptionId,
				'azure.resourceGroupName': instanceMetadata.compute.resourceGroupName,
			});
		} catch (e) {
			return Resource.empty();
		}
	}

	private async _fetchMetadata(): Promise<string> {
		const options = {
			hostname: this.AZURE_IDMS_ENDPOINT,
			port: 80,
			path: this.AZURE_INSTANCE_METADATA_PATH,
			method: 'GET',
			headers: {
				Metadata: 'true',
			},
		};
		return new Promise((resolve, reject) => {
			const timeoutId = setTimeout(() => {
				req.abort();
				reject(new Error('Azure VM metadata api request timed out.'));
			}, 1000);

			const req = http.request(options, (res) => {
				clearTimeout(timeoutId);
				const { statusCode } = res;
				res.setEncoding('utf8');
				let rawData = '';
				res.on('data', (chunk) => (rawData += chunk));
				res.on('end', () => {
					if (statusCode && statusCode >= 200 && statusCode < 300) {
						try {
							resolve(rawData);
						} catch (e) {
							reject(e);
						}
					} else {
						reject(
							new Error('Failed to load page, status code: ' + statusCode),
						);
					}
				});
			});
			req.on('error', (err) => {
				clearTimeout(timeoutId);
				reject(err);
			});
			req.end();
		});
	}
}

export const azureVMDetector = new AzureVMDetector();
