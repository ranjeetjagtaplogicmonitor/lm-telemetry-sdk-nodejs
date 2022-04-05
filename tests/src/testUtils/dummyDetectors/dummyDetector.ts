import {
	Detector,
	Resource,
	ResourceDetectionConfig,
} from '@opentelemetry/resources';

export class DummyDetector implements Detector {
	private resource: Resource;
	constructor(resource: Resource = Resource.empty()) {
		this.resource = resource;
	}
	async detect(_config?: ResourceDetectionConfig): Promise<Resource> {
		return this.resource;
	}
}
