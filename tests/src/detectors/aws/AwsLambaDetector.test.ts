import {
	awsLambdaDetector,
	AwsLambdaDetectorWithContext,
} from '../../../../src/detectors/aws/AwsLambdaDetector';
import { awsLambdaDetector as otelAWSLambdaDetector } from '@opentelemetry/resource-detector-aws';
import { STSClient } from '@aws-sdk/client-sts';

const { Resource } = require('@opentelemetry/resources');
const {
	SemanticResourceAttributes,
	CloudPlatformValues,
} = require('@opentelemetry/semantic-conventions');

jest.mock('@opentelemetry/resource-detector-aws');

afterEach(() => {
	jest.clearAllMocks();
});

describe('AwsLambdaDetector', () => {
	it('should be defined', () => {
		expect(awsLambdaDetector).toBeDefined();
	});

	it('should return empty resource if Lambda not detected', async () => {
		const mockedDetect = jest.spyOn(otelAWSLambdaDetector, 'detect');
		mockedDetect.mockReturnValue(Promise.resolve(Resource.empty()));
		const resource = await awsLambdaDetector.detect();
		expect(resource).toBe(Resource.empty());

		mockedDetect.mockRestore();

		mockedDetect.mockReturnValue(
			Promise.reject(new Error('Lambda not detected')),
		);
		const resource1 = await awsLambdaDetector.detect();
		expect(resource1).toBe(Resource.empty());
	});

	it('should check for context and retrieve invokedFunctionArn', async () => {
		const context = {
			invokedFunctionArn:
				'arn:aws:lambda:us-west-2:123456789012:function:my-function:$LATEST',
		};
		const mockedDetect = jest.spyOn(otelAWSLambdaDetector, 'detect');
		mockedDetect.mockImplementation((): Promise<any> => {
			return Promise.resolve(
				new Resource({
					[SemanticResourceAttributes.CLOUD_REGION]: 'us-west-2',
					[SemanticResourceAttributes.CLOUD_PROVIDER]: 'AWS',
					[SemanticResourceAttributes.FAAS_NAME]: 'my-function',
					[SemanticResourceAttributes.FAAS_VERSION]: '$LATEST',
				}),
			);
		});

		const detector = new AwsLambdaDetectorWithContext(context);

		const resource = await detector.detect();
		expect(resource.attributes['faas.id']).toBe(
			'arn:aws:lambda:us-west-2:123456789012:function:my-function:$LATEST',
		);
		expect(resource.attributes[SemanticResourceAttributes.CLOUD_PLATFORM]).toBe(
			CloudPlatformValues.AWS_LAMBDA,
		);
	});

	it('should make api call if context not present', async () => {
		const mockedDetect = jest.spyOn(otelAWSLambdaDetector, 'detect');
		mockedDetect.mockImplementation((): Promise<any> => {
			return Promise.resolve(
				new Resource({
					[SemanticResourceAttributes.CLOUD_REGION]: 'us-west-2',
					[SemanticResourceAttributes.CLOUD_PROVIDER]: 'AWS',
					[SemanticResourceAttributes.FAAS_NAME]: 'my-function',
					[SemanticResourceAttributes.FAAS_VERSION]: '$LATEST',
				}),
			);
		});

		const mockedSend = jest.spyOn(STSClient.prototype, 'send');
		mockedSend.mockImplementation(() => {
			return Promise.resolve({
				Account: '123456789012',
			});
		});
		const resource = await awsLambdaDetector.detect();
		expect(
			resource.attributes[SemanticResourceAttributes.CLOUD_ACCOUNT_ID],
		).toBe('123456789012');
		expect(resource.attributes[SemanticResourceAttributes.CLOUD_PLATFORM]).toBe(
			CloudPlatformValues.AWS_LAMBDA,
		);
		mockedSend.mockRestore();
	});

	it('should make api call if context present but invokedFunctionArn is not present', async () => {
		const context = {
			dummyKey: 'dummyKey',
		};
		const mockedDetect = jest.spyOn(otelAWSLambdaDetector, 'detect');
		mockedDetect.mockImplementation((): Promise<any> => {
			return Promise.resolve(
				new Resource({
					[SemanticResourceAttributes.CLOUD_REGION]: 'us-west-2',
					[SemanticResourceAttributes.CLOUD_PROVIDER]: 'AWS',
					[SemanticResourceAttributes.FAAS_NAME]: 'my-function',
					[SemanticResourceAttributes.FAAS_VERSION]: '$LATEST',
				}),
			);
		});
		const mockedSend = jest.spyOn(STSClient.prototype, 'send');
		mockedSend.mockImplementation(() => {
			return Promise.resolve({
				Account: '123456789012',
			});
		});
		const detector = new AwsLambdaDetectorWithContext(context);
		const resource = await detector.detect();
		expect(
			resource.attributes[SemanticResourceAttributes.CLOUD_ACCOUNT_ID],
		).toBe('123456789012');
		expect(resource.attributes[SemanticResourceAttributes.CLOUD_PLATFORM]).toBe(
			CloudPlatformValues.AWS_LAMBDA,
		);
		mockedSend.mockRestore();
	});

	it('should return empty resource if api call fails', async () => {
		const mockedDetect = jest.spyOn(otelAWSLambdaDetector, 'detect');
		mockedDetect.mockImplementation((): Promise<any> => {
			return Promise.resolve(
				new Resource({
					[SemanticResourceAttributes.CLOUD_REGION]: 'us-west-2',
					[SemanticResourceAttributes.CLOUD_PROVIDER]: 'AWS',
					[SemanticResourceAttributes.FAAS_NAME]: 'my-function',
					[SemanticResourceAttributes.FAAS_VERSION]: '$LATEST',
				}),
			);
		});
		const mockedSend = jest.spyOn(STSClient.prototype, 'send');
		mockedSend.mockImplementation(() => {
			return Promise.reject(new Error('API call failed'));
		});

		const resource = await awsLambdaDetector.detect();
		expect(resource).toBe(Resource.empty());
		mockedSend.mockRestore();
	});

	it('should return empty resource if api call succeeds but Account id not present in response', async () => {
		const mockedDetect = jest.spyOn(otelAWSLambdaDetector, 'detect');
		mockedDetect.mockImplementation((): Promise<any> => {
			return Promise.resolve(
				new Resource({
					[SemanticResourceAttributes.CLOUD_REGION]: 'us-west-2',
					[SemanticResourceAttributes.CLOUD_PROVIDER]: 'AWS',
					[SemanticResourceAttributes.FAAS_NAME]: 'my-function',
					[SemanticResourceAttributes.FAAS_VERSION]: '$LATEST',
				}),
			);
		});
		const mockedSend = jest.spyOn(STSClient.prototype, 'send');
		mockedSend.mockImplementation(() => {
			return Promise.resolve({
				dummyKey: 'dummyValue',
			});
		});
		const resource = await awsLambdaDetector.detect();
		expect(resource).toBe(Resource.empty());
		mockedSend.mockRestore();
	});
});
