import {
    Detector,
    Resource,
    ResourceDetectionConfig,
  } from '@opentelemetry/resources';
import { awsEc2Detector as otelAWSEc2Detector } from '@opentelemetry/resource-detector-aws';


class AwsEc2Detector implements Detector {

    async detect(_config?: ResourceDetectionConfig): Promise<Resource> {
        let awsResource =  otelAWSEc2Detector.detect();
        
        //TODO: implement PrivateIP detection


        return awsResource;
    }
}

export const awsEc2Detector = new AwsEc2Detector();