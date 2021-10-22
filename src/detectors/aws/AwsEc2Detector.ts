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
            let arn = `aws:ec2:${awsResource.attributes['cloud.region']}:${awsResource.attributes['cloud.account.id']}:instance/${awsResource.attributes['host.id']}`
            const updatedResource = new Resource({
                'aws.arn': arn
            })
            awsResource = awsResource.merge(updatedResource)
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