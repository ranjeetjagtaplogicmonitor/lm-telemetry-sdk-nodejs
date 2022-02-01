import {
	Detector,
	Resource,
	ResourceDetectionConfig,
} from '@opentelemetry/resources';

import { detectorFactory } from './detectors/factory';

class LMResourceDetector implements Detector {
	private context;

	constructor(context?: {}) {
		this.context = context;
	}

	async detect(_config?: ResourceDetectionConfig): Promise<Resource> {
		const detectors = this.context
			? detectorFactory.getDetectors(this.context)
			: detectorFactory.getDetectors();

		for (let i = 0; i < detectors.length; i++) {
			const resource = await detectors[i].detect();
			if (
				Object.keys(resource).length > 0 &&
				Object.keys(resource.attributes).length > 0
			) {
				return resource;
			}
		}

		return Resource.empty();
	}
}

export const lmResourceDetector = new LMResourceDetector();
export const lmResourceDetectorWithContext = LMResourceDetector;
// export * from './detectors/aws';
