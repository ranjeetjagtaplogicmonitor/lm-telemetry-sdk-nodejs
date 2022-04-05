import { awsEc2Detector } from '../../../../src/detectors/aws/AwsEc2Detector';
import { awsEc2Detector as otelAWSEc2Detector } from '@opentelemetry/resource-detector-aws';
const { Resource } = require('@opentelemetry/resources');
const {
	SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions');

jest.mock('@opentelemetry/resource-detector-aws');

afterEach(() => {
	jest.clearAllMocks();
});

describe('AwsEc2Detector', () => {
	it('should be defined', () => {
		expect(awsEc2Detector).toBeDefined();
	});

	it('should detect successfully and add arn', async () => {
		const mockedDetect = jest.spyOn(otelAWSEc2Detector, 'detect');
		mockedDetect.mockImplementation((): Promise<any> => {
			return Promise.resolve(
				new Resource({
					[SemanticResourceAttributes.CLOUD_REGION]: 'us-west-2',
					[SemanticResourceAttributes.CLOUD_ACCOUNT_ID]: '123456789012',
					[SemanticResourceAttributes.HOST_ID]: 'i-1234567890abcdef0',
				}),
			);
		});

		const awsResource = await awsEc2Detector.detect();

		expect(mockedDetect.mock.calls.length).toBe(1);
		expect(awsResource).toBeDefined();
		expect(awsResource.attributes['aws.arn']).toBe(
			'aws:ec2:us-west-2:123456789012:instance/i-1234567890abcdef0',
		);
	});

	it('should return empty Resource if EC2 not detected', async () => {
		const mockedDetect = jest.spyOn(otelAWSEc2Detector, 'detect');
		mockedDetect.mockImplementation((): Promise<any> => {
			return Promise.reject(new Error('Time out'));
		});

		const awsResource = await awsEc2Detector.detect();

		expect(mockedDetect.mock.calls.length).toBe(1);
		expect(awsResource).toBeDefined();
		expect(awsResource).toBe(Resource.empty());
		expect(awsResource.attributes['aws.arn']).toBeUndefined();
	});
});
