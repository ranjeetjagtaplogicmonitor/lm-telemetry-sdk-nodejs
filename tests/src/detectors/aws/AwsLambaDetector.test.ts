import { mocked } from 'ts-jest/utils';
import {
	awsLambdaDetector,
	AwsLambdaDetectorWithContext,
} from '../../../../src/detectors/aws/AwsLambdaDetector';
import { awsLambdaDetector as otelAWSLambdaDetector } from '@opentelemetry/resource-detector-aws';

const { Resource } = require('@opentelemetry/resources');
const {
	SemanticResourceAttributes,
	CloudPlatformValues,
} = require('@opentelemetry/semantic-conventions');

jest.mock('@opentelemetry/resource-detector-aws');
jest.mock('@aws-sdk/client-lambda');

beforeEach(() => {
	mocked(otelAWSLambdaDetector.detect).mockClear();
});

describe('AwsLambdaDetector', () => {
	it('should be defined', () => {
		expect(awsLambdaDetector).toBeDefined();
	});

	it('should return empty resource if Lambda not detected', async () => {
		mocked(otelAWSLambdaDetector.detect).mockReturnValue(
			Promise.resolve(Resource.empty()),
		);
		const resource = await awsLambdaDetector.detect();
		expect(resource).toBe(Resource.empty());

		mocked(otelAWSLambdaDetector.detect).mockClear();

		mocked(otelAWSLambdaDetector.detect).mockReturnValue(
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
		mocked(otelAWSLambdaDetector.detect).mockImplementation(
			(): Promise<any> => {
				return Promise.resolve(
					new Resource({
						[SemanticResourceAttributes.CLOUD_REGION]: 'us-west-2',
						[SemanticResourceAttributes.CLOUD_PROVIDER]: 'AWS',
						[SemanticResourceAttributes.FAAS_NAME]: 'my-function',
						[SemanticResourceAttributes.FAAS_VERSION]: '$LATEST',
					}),
				);
			},
		);

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
		mocked(otelAWSLambdaDetector.detect).mockImplementation(
			(): Promise<any> => {
				return Promise.resolve(
					new Resource({
						[SemanticResourceAttributes.CLOUD_REGION]: 'us-west-2',
						[SemanticResourceAttributes.CLOUD_PROVIDER]: 'AWS',
						[SemanticResourceAttributes.FAAS_NAME]: 'my-function',
						[SemanticResourceAttributes.FAAS_VERSION]: '$LATEST',
					}),
				);
			},
		);

		const _getAccountId = jest.spyOn(awsLambdaDetector as any, '_getAccountId');
		_getAccountId.mockImplementation(() => {
			return '123456789012';
		});
		const resource = await awsLambdaDetector.detect();
		expect(
			resource.attributes[SemanticResourceAttributes.CLOUD_ACCOUNT_ID],
		).toBe('123456789012');
		expect(resource.attributes[SemanticResourceAttributes.CLOUD_PLATFORM]).toBe(
			CloudPlatformValues.AWS_LAMBDA,
		);
	});

	it('should return empty resource if api call fails', async () => {
		mocked(otelAWSLambdaDetector.detect).mockImplementation(
			(): Promise<any> => {
				return Promise.resolve(
					new Resource({
						[SemanticResourceAttributes.CLOUD_REGION]: 'us-west-2',
						[SemanticResourceAttributes.CLOUD_PROVIDER]: 'AWS',
						[SemanticResourceAttributes.FAAS_NAME]: 'my-function',
						[SemanticResourceAttributes.FAAS_VERSION]: '$LATEST',
					}),
				);
			},
		);

		const _getAccountId = jest.spyOn(awsLambdaDetector as any, '_getAccountId');
		_getAccountId.mockImplementation(() => {
			return Promise.reject(new Error('Api call failed'));
		});

		const resource = await awsLambdaDetector.detect();
		expect(resource).toBe(Resource.empty());
	});
});
