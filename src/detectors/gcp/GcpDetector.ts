import {
	Detector,
	Resource,
	ResourceDetectionConfig,
} from '@opentelemetry/resources';
import { gcpDetector as otelGCPDetector } from '@opentelemetry/resource-detector-gcp';
import { cLogger } from '../../utils/logger';

class GcpDetector implements Detector {
	async detect(_config?: ResourceDetectionConfig): Promise<Resource> {
		try {
			const gcpResource = await otelGCPDetector.detect();
			return gcpResource;
		} catch (e) {
			cLogger.error('Error: ', e);
			return Resource.empty();
		}
	}
}

export const gcpDetector = new GcpDetector();
