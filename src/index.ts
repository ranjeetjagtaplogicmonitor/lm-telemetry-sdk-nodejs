import {
    Detector,
    Resource,
    ResourceDetectionConfig,
} from '@opentelemetry/resources';

import {awsEc2Detector, awsLambdaDetector, awsLambdaDetectorWithContext} from './detectors/aws'

class LMResourceDetector implements Detector {

    private context;

    constructor(context?: {}) {
        this.context = context;
    }

    async detect(_config?: ResourceDetectionConfig): Promise<Resource> {
        console.log("Hii from LMSDK")
        //LAMBDA
        let awsResource = (this.context)?await new awsLambdaDetectorWithContext(this.context).detect():await awsLambdaDetector.detect();
        console.log("awsResource after lambfa: ", awsResource)
        if(Object.keys(awsResource).length > 0 && Object.keys(awsResource.attributes).length > 0) {
            
            return awsResource

        } else {
            //EC2
            console.log("In else section")
            awsResource = await awsEc2Detector.detect();
            
            if(Object.keys(awsResource).length > 0 && Object.keys(awsResource.attributes).length > 0) {
                
                return awsResource
            }

        }
        
        console.log("Before empty return in LMResourceDetector")
        return Resource.empty();
        
    }
}

export const lmResourceDetector = new LMResourceDetector()
export const lmResourceDetectorWithContext = LMResourceDetector;
//export * from './detectors/aws';
