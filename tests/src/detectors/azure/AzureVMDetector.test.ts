import { azureVMDetector } from '../../../../src/detectors/azure/AzureVMDetector';
// import { mocked } from 'ts-jest/utils';
// const { Resource } = require('@opentelemetry/resources');
import {
	CloudProviderValues,
	CloudPlatformValues,
	SemanticResourceAttributes,
} from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
const nock = require('nock');

describe('AzureVMDetector', () => {
	beforeEach(() => {
		nock.disableNetConnect();
		nock.cleanAll();
	});

	afterEach(() => {
		nock.enableNetConnect();
	});
	it('should be defined', () => {
		expect(azureVMDetector).toBeDefined();
	});

	it('should return Resource if Azure VM is detected', async () => {
		const scope = nock('http://' + azureVMDetector.AZURE_IDMS_ENDPOINT)
			.get('/metadata/instance')
			.query({ 'api-version': azureVMDetector.AZURE_API_VERSION })
			.matchHeader('Metadata', 'true')
			.reply(200, {
				compute: {
					azEnvironment: 'AzurePublicCloud',
					location: 'westus',
					name: 'resource-detection-test',
					resourceGroupName: 'anupam-lm',
					subscriptionId: '313442e3-a1e5-4ffd-8436-014sdcd06b74',
					vmId: '8f168d33-4398-4293-b624-70b15486440c',
					vmSize: 'Standard_B1ls',
					zone: '',
				},
			});
		const resource = await azureVMDetector.detect();

		expect(resource).toBeDefined();
		expect(resource.attributes).toEqual({
			[SemanticResourceAttributes.CLOUD_PROVIDER]: CloudProviderValues.AZURE,
			[SemanticResourceAttributes.CLOUD_PLATFORM]: CloudPlatformValues.AZURE_VM,
			[SemanticResourceAttributes.CLOUD_REGION]: 'westus',
			[SemanticResourceAttributes.CLOUD_AVAILABILITY_ZONE]: 'westus',
			[SemanticResourceAttributes.HOST_ID]:
				'8f168d33-4398-4293-b624-70b15486440c',
			[SemanticResourceAttributes.HOST_NAME]: 'resource-detection-test',
			'azure.vm.size': 'Standard_B1ls',
			[SemanticResourceAttributes.CLOUD_ACCOUNT_ID]:
				'313442e3-a1e5-4ffd-8436-014sdcd06b74',
			'azure.resourceGroupName': 'anupam-lm',
		});
		scope.done();
	});

	it('should return empty resource if IDMS times out(1000ms)', async () => {
		const scope = nock('http://' + azureVMDetector.AZURE_IDMS_ENDPOINT)
			.get('/metadata/instance')
			.query({ 'api-version': azureVMDetector.AZURE_API_VERSION })
			.matchHeader('Metadata', 'true')
			.delay(2000)
			.reply(200, {
				compute: {
					azEnvironment: 'AzurePublicCloud',
					location: 'westus',
					name: 'resource-detection-test',
					resourceGroupName: 'anupam-lm',
					subscriptionId: '313442e3-a1e5-4ffd-8436-014sdcd06b74',
					vmId: '8f168d33-4398-4293-b624-70b15486440c',
					vmSize: 'Standard_B1ls',
					zone: '',
				},
			});
		const resource = await azureVMDetector.detect();

		expect(resource).toBeDefined();
		expect(resource).toBe(Resource.empty());
		scope.done();
	});
});
