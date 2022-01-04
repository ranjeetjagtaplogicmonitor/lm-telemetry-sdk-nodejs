import { Detector } from '@opentelemetry/resources';
import {awsEc2Detector, awsEcsDetector, awsLambdaDetector, awsLambdaDetectorWithContext} from './aws';
import {gcpDetector, cloudFunctionDetector} from './gcp';
class DetectorFactory {

    getDetectors(context?: {}): Detector[] {
        let detectors = [];

        ///////////////////////////////
        //                           //
        //    Detector from ENV      //
        //                           //
        ///////////////////////////////


        if(process.env.LM_RESOURCE_DETECTOR){

            switch(process.env.LM_RESOURCE_DETECTOR){
                case 'aws_ec2':
                    detectors.push(awsEc2Detector);
                    break;
                case 'aws_ecs':
                    detectors.push(awsEcsDetector);
                    break;
                case 'aws_lambda':
                    if(context){
                        detectors.push(new awsLambdaDetectorWithContext(context));
                    } else {
                        detectors.push(awsLambdaDetector);
                    }
                    break;
                case 'gcp':
                    detectors.push(gcpDetector);
                    break;
                case 'gcp_cloud_functions':
                    detectors.push(cloudFunctionDetector);
                    break;
                default:
                    console.log("Unknown detector: ", process.env.LM_RESOURCE_DETECTOR," using all available detectors");
            }
        }

        if(detectors.length === 0){
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

            //AWS ECS DETECTOR
            detectors.push(awsEcsDetector);
            ///////////////////////////////
            //                           //
            //        GCP DETECTORS      //
            //                           //
            ///////////////////////////////

            detectors.push(cloudFunctionDetector);
            detectors.push(gcpDetector);
        }
        return detectors;
    }

}

export const detectorFactory = new DetectorFactory();