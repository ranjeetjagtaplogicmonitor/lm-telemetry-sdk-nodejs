import {
	lmResourceDetector,
	LmResourceDetectorWithContext,
} from '../../src/index';
import { detectorFactory } from '../../src/detectors/factory';
import { Resource } from '@opentelemetry/resources';
import { DummyDetector } from './testUtils/dummyDetectors';
describe('testing', () => {
	it('should work', () => {
		expect(true).toBeTruthy();
	});
});

describe('index.js', () => {
	it('should be defined', () => {
		expect(lmResourceDetector).toBeDefined();
		expect(LmResourceDetectorWithContext).toBeDefined();
	});

	it('should return empty resource if no resource is detected', async () => {
		const detectorFactoryMock = jest.spyOn(detectorFactory, 'getDetectors');
		detectorFactoryMock.mockImplementation(() => {
			return [new DummyDetector()];
		});
		const resource = await lmResourceDetector.detect();
		expect(resource).toBe(Resource.empty());

		const detectorWithContext = new LmResourceDetectorWithContext({
			dummyKey: 'dummyValue',
		});
		const resource1 = await detectorWithContext.detect();
		expect(resource1).toBe(Resource.empty());
		detectorFactoryMock.mockRestore();
	});

	it('should return resource if detected', async () => {
		const detectorFactoryMock = jest.spyOn(detectorFactory, 'getDetectors');
		const expectedResource = new Resource({
			dummyKey: 'dummyValue',
		});

		detectorFactoryMock.mockImplementation(() => {
			return [new DummyDetector(expectedResource)];
		});
		const resource = await lmResourceDetector.detect();
		expect(resource).toBe(expectedResource);

		const detectorWithContext = new LmResourceDetectorWithContext({
			dummyKey: 'dummyValue',
		});
		const resource1 = await detectorWithContext.detect();
		expect(resource1).toBe(expectedResource);
		detectorFactoryMock.mockRestore();
	});
});
