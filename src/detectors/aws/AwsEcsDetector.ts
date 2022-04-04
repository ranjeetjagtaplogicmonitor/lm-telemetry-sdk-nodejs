import {
	Detector,
	Resource,
	ResourceDetectionConfig,
} from '@opentelemetry/resources';
import { cLogger } from '../../utils/logger';

import { awsEcsDetector as otelAWSEcsDetector } from '@opentelemetry/resource-detector-aws';

class AwsEcsDetector implements Detector {
	async detect(_config?: ResourceDetectionConfig): Promise<Resource> {
		try {
			const awsResource = await otelAWSEcsDetector.detect();

			return awsResource;
		} catch (e) {
			cLogger.error('Error: ', e);
			return Resource.empty();
		}
	}
}

export const awsEcsDetector = new AwsEcsDetector();
