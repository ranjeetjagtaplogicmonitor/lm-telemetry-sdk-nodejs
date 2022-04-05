import { gcpDetector } from '../../../../src/detectors/gcp/GcpDetector';
import { gcpDetector as otelGCPDetector } from '@opentelemetry/resource-detector-gcp';
import { Resource } from '@opentelemetry/resources';
const {
	SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions');

jest.mock('@opentelemetry/resource-detector-gcp');

afterEach(() => {
	jest.clearAllMocks();
});

describe('GCP Detectors', () => {
	it('should return empty resource if GCP not detected', async () => {
		const mockedDetect = jest.spyOn(otelGCPDetector, 'detect');
		mockedDetect.mockImplementation((): Promise<any> => {
			return Promise.reject(new Error('GCP not detected'));
		});

		const resource = await gcpDetector.detect();
		expect(resource).toEqual(Resource.empty());
	});

	it('should return GCP resource if detected', async () => {
		const expectedResource = new Resource({
			[SemanticResourceAttributes.CLOUD_ACCOUNT_ID]:
				'mycompany.com:api-project-123456789012',
			[SemanticResourceAttributes.CLOUD_AVAILABILITY_ZONE]: 'asia-south1-c',
			[SemanticResourceAttributes.HOST_ID]: '1234567890123456789',
			[SemanticResourceAttributes.CLOUD_PROVIDER]: 'gcp',
		});
		const mockedDetect = jest.spyOn(otelGCPDetector, 'detect');
		mockedDetect.mockImplementation((): Promise<any> => {
			return Promise.resolve(expectedResource);
		});

		const resource = await gcpDetector.detect();

		expect(resource).toEqual(expectedResource);
	});
});
