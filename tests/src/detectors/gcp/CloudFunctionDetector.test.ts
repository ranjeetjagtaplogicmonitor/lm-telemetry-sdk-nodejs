import { cloudFunctionDetector } from "../../../../src/detectors/gcp/CloudFunctionDetector";
import { mocked } from "ts-jest/utils";
const gcpMetadata = require('gcp-metadata');
import { Resource } from "@opentelemetry/resources";
const { SemanticResourceAttributes } =require( "@opentelemetry/semantic-conventions");

jest.mock('gcp-metadata')

beforeEach(() => {
    mocked(gcpMetadata.isAvailable).mockClear();
    mocked(gcpMetadata.instance).mockClear();
})

describe('GCP CloudFunction Detector', () => {

    it('should return empty Resource if GCP metadata is not available', async () => {
        
        mocked(gcpMetadata.isAvailable).mockReturnValue(Promise.resolve(false));

        const resource = await cloudFunctionDetector.detect();
        expect(resource).toBe(Resource.empty());

    })

    it('should return populated Resource if GCP metadata is available', async () => {

        mocked(gcpMetadata.isAvailable).mockReturnValue(Promise.resolve(true));
        mocked(gcpMetadata.project).mockReturnValue(Promise.resolve('test-project'));
        mocked(gcpMetadata.instance).mockImplementation((param: string) => {
            
            //let res = ""
            switch(param) {
                case 'region':
                    return Promise.resolve('test-region');
                case 'zone':
                    return Promise.resolve('test-zone');
                default:
                    return Promise.resolve();
            }

        });

        process.env.K_SERVICE = 'test-service';

        const resource = await cloudFunctionDetector.detect();

        expect(resource).toMatchObject(new Resource({
            [SemanticResourceAttributes.CLOUD_PROVIDER]: 'gcp',
            [SemanticResourceAttributes.CLOUD_REGION]: 'test-region',
            [SemanticResourceAttributes.CLOUD_AVAILABILITY_ZONE]: 'test-zone',
            [SemanticResourceAttributes.CLOUD_ACCOUNT_ID]: 'test-project',
            [SemanticResourceAttributes.FAAS_NAME]: 'test-service'
        }))

    })

})
