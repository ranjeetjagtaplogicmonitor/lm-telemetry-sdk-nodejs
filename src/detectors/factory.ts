import { Detector } from '@opentelemetry/resources';
import {awsEc2Detector, awsLambdaDetector, awsLambdaDetectorWithContext} from './aws';

class DetectorFactory {

    getDetectors(context?: {}): Detector[] {
        let detectors = [];

        ///////////////////////////////
        //                           //
        //        AWS DETECTORS      //
        //                           //
        ///////////////////////////////

        //AWS LAMBDA DETECTOR
        if(context){
            detectors.push(new awsLambdaDetectorWithContext(context));
        } else {
            detectors.push(awsLambdaDetector);
        }

        //AWS EC2 DETECTOR
        detectors.push(awsEc2Detector);

        return detectors;
    }

}

export const detectorFactory = new DetectorFactory();