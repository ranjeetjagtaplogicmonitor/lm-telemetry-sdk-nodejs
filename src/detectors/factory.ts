import { Detector } from '@opentelemetry/resources';
import { cLogger } from '../utils/logger';
import {
	awsEc2Detector,
	awsEcsDetector,
	awsLambdaDetector,
	AwsLambdaDetectorWithContext,
} from './aws';
import { gcpDetector, cloudFunctionDetector } from './gcp';
import {
	azureVMDetector,
	azureFunctionsDetector,
	AzureFunctionsDetectorWithContext,
} from './azure';
class DetectorFactory {
	getDetectors(context?: {}): Detector[] {
		const detectors = [];

		// /////////////////////////////
		//                           //
		//    Detector from ENV      //
		//                           //
		// /////////////////////////////

		if (process.env.LM_RESOURCE_DETECTOR) {
			switch (process.env.LM_RESOURCE_DETECTOR) {
				case 'aws_ec2':
					detectors.push(awsEc2Detector);
					break;
				case 'aws_ecs':
					detectors.push(awsEcsDetector);
					break;
				case 'aws_lambda':
					if (context) {
						detectors.push(new AwsLambdaDetectorWithContext(context));
					} else {
						detectors.push(awsLambdaDetector);
					}
					break;
				case 'gcp_compute_engine':
				case 'gcp_kubernetes_engine':
					detectors.push(gcpDetector);
					break;
				case 'gcp_cloud_functions':
					detectors.push(cloudFunctionDetector);
					break;
				case 'azure_vm':
					detectors.push(azureVMDetector);
					break;
				case 'azure_functions':
					if (context) {
						detectors.push(new AzureFunctionsDetectorWithContext(context));
					} else {
						detectors.push(azureFunctionsDetector);
					}
					break;
				default:
					cLogger.debug(
						'Unknown detector specified in LM_RESOURCE_DETECTOR: ',
						process.env.LM_RESOURCE_DETECTOR,
						' using all available detectors',
					);
			}
		}

		if (detectors.length === 0) {
			// /////////////////////////////
			//                           //
			//        AWS DETECTORS      //
			//                           //
			// /////////////////////////////

			// AWS LAMBDA DETECTOR
			if (context) {
				detectors.push(new AwsLambdaDetectorWithContext(context));
			} else {
				detectors.push(awsLambdaDetector);
			}

			// AWS EC2 DETECTOR
			detectors.push(awsEc2Detector);

			// AWS ECS DETECTOR
			detectors.push(awsEcsDetector);
			// /////////////////////////////
			//                           //
			//        GCP DETECTORS      //
			//                           //
			// /////////////////////////////

			detectors.push(cloudFunctionDetector);
			detectors.push(gcpDetector);

			// /////////////////////////////
			//                           //
			//        AZURE DETECTORS    //
			//                           //
			// /////////////////////////////

			detectors.push(azureVMDetector);
			if (context) {
				detectors.push(new AzureFunctionsDetectorWithContext(context));
			} else {
				detectors.push(azureFunctionsDetector);
			}
		}
		return detectors;
	}
}

export const detectorFactory = new DetectorFactory();
