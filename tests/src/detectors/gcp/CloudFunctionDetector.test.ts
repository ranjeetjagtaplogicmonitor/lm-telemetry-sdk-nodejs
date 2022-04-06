import { cloudFunctionDetector } from '../../../../src/detectors/gcp/CloudFunctionDetector';
const gcpMetadata = require('gcp-metadata');
import { Resource } from '@opentelemetry/resources';
const {
	SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions');

jest.mock('gcp-metadata');

afterEach(() => {
	jest.clearAllMocks();
});

describe('GCP CloudFunction Detector', () => {
	it('should return empty Resource if GCP metadata is not available', async () => {
		const mockedIsAvailable = jest.spyOn(gcpMetadata, 'isAvailable');
		mockedIsAvailable.mockReturnValue(Promise.resolve(false));

		const resource = await cloudFunctionDetector.detect();
		expect(resource).toBe(Resource.empty());
	});

	it('should return populated Resource if GCP metadata is available', async () => {
		const mockedIsAvailable = jest.spyOn(gcpMetadata, 'isAvailable');
		mockedIsAvailable.mockReturnValue(Promise.resolve(true));
		const mockedProject = jest.spyOn(gcpMetadata, 'project');
		mockedProject.mockReturnValue(Promise.resolve('test-project'));
		const mockedInstance = jest.spyOn(gcpMetadata, 'instance');
		mockedInstance.mockImplementation((param): Promise<any> => {
			switch (param) {
				case 'region':
					return Promise.resolve('test-region');
				case 'zone':
					return Promise.resolve('test-zone');
				default:
					return Promise.resolve();
			}
		});

		process.env.K_SERVICE = 'test-service';

		const resource = await cloudFunctionDetector.detect();

		expect(resource).toMatchObject(
			new Resource({
				[SemanticResourceAttributes.CLOUD_PROVIDER]: 'gcp',
				[SemanticResourceAttributes.CLOUD_REGION]: 'test-region',
				[SemanticResourceAttributes.CLOUD_AVAILABILITY_ZONE]: 'test-zone',
				[SemanticResourceAttributes.CLOUD_ACCOUNT_ID]: 'test-project',
				[SemanticResourceAttributes.FAAS_NAME]: 'test-service',
			}),
		);
	});

	it('should return empty resource if there is an error', async () => {
		const mockedIsAvailable = jest.spyOn(gcpMetadata, 'isAvailable');
		mockedIsAvailable.mockReturnValue(Promise.resolve(true));
		const mockedProject = jest.spyOn(gcpMetadata, 'project');
		mockedProject.mockReturnValue(Promise.reject(new Error('error')));

		const resource = await cloudFunctionDetector.detect();
		expect(resource).toBe(Resource.empty());
	});
});
