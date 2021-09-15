import {
    Detector,
    Resource,
    ResourceDetectionConfig,
} from '@opentelemetry/resources';
import { gcpDetector as otelGCPDetector } from '@opentelemetry/resource-detector-gcp';

class GcpDetector implements Detector {

    async detect(_config?: ResourceDetectionConfig): Promise<Resource> {
        
        try {
            
            let gcpResource = await otelGCPDetector.detect();
            return gcpResource;
        }
        catch(e) {
            console.log("Error: ", e);
            return Resource.empty();
        }
        
    }

}

export const gcpDetector = new GcpDetector();