/* eslint-disable prettier/prettier */
// import { mocked } from 'ts-jest/utils';
import {
	azureFunctionsDetector,
	AzureFunctionsDetectorWithContext,
} from '../../../../src/detectors/azure/AzureFunctionsDetector';
const { Resource } = require('@opentelemetry/resources');
const {
	SemanticResourceAttributes,
	CloudProviderValues,
	CloudPlatformValues,
} = require('@opentelemetry/semantic-conventions');

describe('AzureFunctionsDetector', () => {
	const OLD_ENV = process.env;

	beforeEach(() => {
		jest.resetModules(); // Most important - it clears the cache
		process.env = { ...OLD_ENV }; // Make a copy
	});

	afterAll(() => {
		process.env = OLD_ENV; // Restore old environment
	});
	it('should be defined', () => {
		expect(AzureFunctionsDetectorWithContext).toBeDefined();
	});

	it('should return empty resource if FUNCTIONS_WORKER_DIRECTORY is not present in environment variables', async () => {
		const detector = azureFunctionsDetector;
		const resource = await detector.detect();
		expect(resource).toBe(Resource.empty());
	});

	it('should return empty resource if FUNCTIONS_WORKER_DIRECTORY is present in env but does not contain `azure-functions`', async () => {
		process.env.FUNCTIONS_WORKER_DIRECTORY = '/host/workers/node';
		const detector = azureFunctionsDetector;
		const resource = await detector.detect();
		expect(resource).toBe(Resource.empty());
	});

    it('should return resource only with `cloud.provider` and `cloud.platform` populated if `WEBSITE_DEPLOYMENT_ID` is not present in env and context is not as expected', async () => {
		process.env.FUNCTIONS_WORKER_DIRECTORY = '/azure-functions-host/workers/node';
		const detector = azureFunctionsDetector;
		const resource = await detector.detect();
		expect(Object.keys(resource.attributes).length).toBe(2);
		expect(resource.attributes[SemanticResourceAttributes.CLOUD_PROVIDER]).toBe(
			CloudProviderValues.AZURE,
		);
		expect(resource.attributes[SemanticResourceAttributes.CLOUD_PLATFORM]).toBe(
			CloudPlatformValues.AZURE_FUNCTIONS,
		);
	});

	it('should return resource with `faas.id` populated if `WEBSITE_DEPLOYMENT_ID` is present in env and context is not defined', async () => {
		process.env.FUNCTIONS_WORKER_DIRECTORY = '/azure-functions-host/workers/node';
		process.env.WEBSITE_DEPLOYMENT_ID = 'testAzureFunctionApp';
		const detector = azureFunctionsDetector;
		const resource = await detector.detect();
		expect(Object.keys(resource.attributes).length).toBe(3);
		expect(resource.attributes[SemanticResourceAttributes.CLOUD_PROVIDER]).toBe(
			CloudProviderValues.AZURE,
		);
		expect(resource.attributes[SemanticResourceAttributes.CLOUD_PLATFORM]).toBe(
			CloudPlatformValues.AZURE_FUNCTIONS,
		);
		expect(resource.attributes[SemanticResourceAttributes.FAAS_ID]).toBe(
			'testAzureFunctionApp',
		);
	});

	it('should return resource with `faas.name` populated if executionContext in context has functionName and `WEBSITE_DEPLOYMENT_ID` is not present in env', async () => {
		process.env.FUNCTIONS_WORKER_DIRECTORY = '/azure-functions-host/workers/node';
		const context = {
			executionContext: {
				functionName: 'testFunction',
			},
		};
		const detector = new AzureFunctionsDetectorWithContext(context);
		const resource = await detector.detect();
		expect(Object.keys(resource.attributes).length).toBe(3);
		expect(resource.attributes[SemanticResourceAttributes.CLOUD_PROVIDER]).toBe(
			CloudProviderValues.AZURE,
		);
		expect(resource.attributes[SemanticResourceAttributes.CLOUD_PLATFORM]).toBe(
			CloudPlatformValues.AZURE_FUNCTIONS,
		);
		expect(resource.attributes[SemanticResourceAttributes.FAAS_NAME]).toBe(
			'testFunction',
		);
	});

	it('should return resource with `faas.id` and `faas.name` populated when `WEBSITE_DEPLOYMENT_ID` is present in env and executionContext in context has functionName', async () => {
		process.env.FUNCTIONS_WORKER_DIRECTORY = '/azure-functions-host/workers/node';
		const context = {
			executionContext: {
				functionName: 'testFunction',
			},
		};
		process.env.WEBSITE_DEPLOYMENT_ID = 'testAzureFunctionApp';
		const detector = new AzureFunctionsDetectorWithContext(context);
		const resource = await detector.detect();
		expect(Object.keys(resource.attributes).length).toBe(4);
		expect(resource.attributes[SemanticResourceAttributes.CLOUD_PROVIDER]).toBe(
			CloudProviderValues.AZURE,
		);
		expect(resource.attributes[SemanticResourceAttributes.CLOUD_PLATFORM]).toBe(
			CloudPlatformValues.AZURE_FUNCTIONS,
		);
		expect(resource.attributes[SemanticResourceAttributes.FAAS_ID]).toBe(
			'testAzureFunctionApp',
		);
		expect(resource.attributes[SemanticResourceAttributes.FAAS_NAME]).toBe(
			'testFunction',
		);
	});
});
