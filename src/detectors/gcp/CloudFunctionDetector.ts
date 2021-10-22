import {
    Detector,
    Resource,
    ResourceDetectionConfig,
} from '@opentelemetry/resources';
import { CloudProviderValues, SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
const gcpMetadata = require('gcp-metadata');

class CloudFunctionDetector implements Detector {

    async detect(_config?: ResourceDetectionConfig): Promise<Resource> {
        
        try {
            
            let gcpFunctionNameKey = process.env.K_SERVICE;

            const isAvailable = await gcpMetadata.isAvailable();

            if(!isAvailable) {
                return Resource.empty()
            }

            const projectId = await gcpMetadata.project('project-id');
            const region = await gcpMetadata.instance('region');
            const zone = await gcpMetadata.instance('zone');

            const attributes = {
                [SemanticResourceAttributes.CLOUD_PROVIDER]: CloudProviderValues.GCP,
                [SemanticResourceAttributes.FAAS_NAME]: gcpFunctionNameKey,
                [SemanticResourceAttributes.CLOUD_ACCOUNT_ID]: projectId,
                [SemanticResourceAttributes.CLOUD_REGION]: region,
                [SemanticResourceAttributes.CLOUD_AVAILABILITY_ZONE]: zone,

            }

            return new Resource(attributes)
        }
        catch(e) {
            console.log("Error: ", e);
            return Resource.empty();
        }
        
    }

}

export const cloudFunctionDetector = new CloudFunctionDetector();