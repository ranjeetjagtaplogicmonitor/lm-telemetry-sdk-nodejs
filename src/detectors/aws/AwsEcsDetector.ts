import {
    Detector,
    Resource,
    ResourceDetectionConfig,
} from '@opentelemetry/resources';

import { awsEcsDetector as otelAWSEcsDetector } from '@opentelemetry/resource-detector-aws';

class AwsEcsDetector implements Detector {

    async detect(_config?: ResourceDetectionConfig): Promise<Resource> {
        
        try {
            
            let awsResource = await otelAWSEcsDetector.detect();
        
            return awsResource;
        }
        
        catch(e) {
            console.log("Error: ", e);
            return Resource.empty();
        }
        
    }
}

export const awsEcsDetector = new AwsEcsDetector();