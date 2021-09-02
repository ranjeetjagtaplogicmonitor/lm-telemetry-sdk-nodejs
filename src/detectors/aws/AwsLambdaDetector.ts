import {
    Detector,
    Resource,
    ResourceDetectionConfig,
} from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { awsLambdaDetector as otelAWSLambdaDetector } from '@opentelemetry/resource-detector-aws';
import { LambdaClient, GetFunctionCommand } from '@aws-sdk/client-lambda';
/**
 * The AwsLambdaDetector can be used to detect if a process is running in AWS Lambda
 * and return a {@link Resource} populated with data about the environment.
 * Returns an empty Resource if detection fails.
 */
export class AwsLambdaDetector implements Detector {

    private context;

    constructor(context?: {}) {
        this.context = context;
    }

    async detect(_config?: ResourceDetectionConfig): Promise<Resource> {

        console.log("Context: ", this.context);

        let otelResource = await otelAWSLambdaDetector.detect();

        if (Object.keys(otelResource).length === 0) {
            return Resource.empty();
        }

        if(this.context) {
            try{
                console.log("In Context flow")
                const additionalAttributes = { [SemanticResourceAttributes.FAAS_ID]: (this.context as any).invokedFunctionArn }
                const resourceWithAdditionalAttributes = new Resource(additionalAttributes)

                const mergedResource = otelResource.merge(resourceWithAdditionalAttributes)

                return mergedResource;
                
            } catch(e) {
                console.log("invokedFunctionArn key not found in ARN", e)
            }
        }

        try {
            console.log("In API call flow")
            var params = {
                FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME, /* required */
            };
            let lambda = new LambdaClient({});
            const command = new GetFunctionCommand(params);
            const response = await lambda.send(command);

            if (response.Configuration) {
                const additionalAttributes = { [SemanticResourceAttributes.FAAS_ID]: response.Configuration.FunctionArn! }

                const resourceWithAdditionalAttributes = new Resource(additionalAttributes)

                const mergedResource = otelResource.merge(resourceWithAdditionalAttributes)

                return mergedResource;
            }
        }
        catch(e) {
            console.log(e);
            return Resource.empty();
        }
        return Resource.empty();

    }
}

//export const awsLambdaDetector = new AwsLambdaDetector();
export const awsLambdaDetector = new AwsLambdaDetector();
export const awsLambdaDetectorWithContext = AwsLambdaDetector;