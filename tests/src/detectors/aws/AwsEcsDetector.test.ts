import { awsEcsDetector } from '../../../../src/detectors/aws/AwsEcsDetector';
import { mocked } from 'ts-jest/utils';
import { awsEcsDetector as otelAWSEcsDetector } from '@opentelemetry/resource-detector-aws';
const { Resource } = require('@opentelemetry/resources');
// const { SemanticResourceAttributes } =require( "@opentelemetry/semantic-conventions");

jest.mock('@opentelemetry/resource-detector-aws');

beforeEach(() => {
	mocked(otelAWSEcsDetector.detect).mockClear();
});

describe('AwsEcsDetector', () => {
	it('should be defined', () => {
		expect(awsEcsDetector).toBeDefined();
	});

	it('should return empty Resource if ECS not detected', async () => {
		mocked(otelAWSEcsDetector.detect).mockImplementation((): Promise<any> => {
			return Promise.resolve(Resource.empty());
		});

		const awsResource = await awsEcsDetector.detect();

		expect(mocked(otelAWSEcsDetector.detect).mock.calls.length).toBe(1);
		expect(awsResource).toBeDefined();
		expect(awsResource).toBe(Resource.empty());
		expect(awsResource.attributes['aws.arn']).toBeUndefined();
	});

	it('should return empty Resource if there is an exception', async () => {
		mocked(otelAWSEcsDetector.detect).mockImplementation((): Promise<any> => {
			return Promise.reject(new Error('error'));
		});

		const awsResource = await awsEcsDetector.detect();

		expect(mocked(otelAWSEcsDetector.detect).mock.calls.length).toBe(1);
		expect(awsResource).toBeDefined();
		expect(awsResource).toBe(Resource.empty());
		expect(awsResource.attributes['aws.arn']).toBeUndefined();
	});
});
