import { awsEcsDetector } from '../../../../src/detectors/aws/AwsEcsDetector';
import { awsEcsDetector as otelAWSEcsDetector } from '@opentelemetry/resource-detector-aws';
const { Resource } = require('@opentelemetry/resources');
// const { SemanticResourceAttributes } =require( "@opentelemetry/semantic-conventions");

jest.mock('@opentelemetry/resource-detector-aws');

afterEach(() => {
	jest.clearAllMocks();
});

describe('AwsEcsDetector', () => {
	it('should be defined', () => {
		expect(awsEcsDetector).toBeDefined();
	});

	it('should return empty Resource if ECS not detected', async () => {
		const mockedDetect = jest.spyOn(otelAWSEcsDetector, 'detect');
		mockedDetect.mockImplementation((): Promise<any> => {
			return Promise.resolve(Resource.empty());
		});

		const awsResource = await awsEcsDetector.detect();

		expect(mockedDetect.mock.calls.length).toBe(1);
		expect(awsResource).toBeDefined();
		expect(awsResource).toBe(Resource.empty());
		expect(awsResource.attributes['aws.arn']).toBeUndefined();
	});

	it('should return empty Resource if there is an exception', async () => {
		const mockedDetect = jest.spyOn(otelAWSEcsDetector, 'detect');
		mockedDetect.mockImplementation((): Promise<any> => {
			return Promise.reject(new Error('error'));
		});

		const awsResource = await awsEcsDetector.detect();

		expect(mockedDetect.mock.calls.length).toBe(1);
		expect(awsResource).toBeDefined();
		expect(awsResource).toBe(Resource.empty());
		expect(awsResource.attributes['aws.arn']).toBeUndefined();
	});
});
