import {
	Detector,
	Resource,
	ResourceDetectionConfig,
} from '@opentelemetry/resources';
import { cLogger } from './utils/logger';
import { detectorFactory } from './detectors/factory';

class LMResourceDetector implements Detector {
	private context;

	constructor(context?: {}) {
		this.context = context;
	}

	async detect(_config?: ResourceDetectionConfig): Promise<Resource> {
		cLogger.info('detecting resources');
		const detectors = this.context
			? detectorFactory.getDetectors(this.context)
			: detectorFactory.getDetectors();

		for (let i = 0; i < detectors.length; i++) {
			const resource = await detectors[i].detect();
			if (
				Object.keys(resource).length > 0 &&
				Object.keys(resource.attributes).length > 0
			) {
				cLogger.debug('detected resource: ', resource);
				return resource;
			}
		}
		cLogger.info('no resources detected');
		return Resource.empty();
	}
}

export const lmResourceDetector = new LMResourceDetector();
export const LmResourceDetectorWithContext = LMResourceDetector;
