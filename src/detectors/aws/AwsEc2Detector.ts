import {
    Detector,
    Resource,
    ResourceDetectionConfig,
} from '@opentelemetry/resources';
import { awsEc2Detector as otelAWSEc2Detector } from '@opentelemetry/resource-detector-aws';


class AwsEc2Detector implements Detector {

    async detect(_config?: ResourceDetectionConfig): Promise<Resource> {
        
        try {
            
            let awsResource = await otelAWSEc2Detector.detect();
            return awsResource;
        }
        //TODO: implement PrivateIP detection
        catch(e) {
            console.log("Error: ", e);
            return Resource.empty();
        }
        
    }
}

export const awsEc2Detector = new AwsEc2Detector();