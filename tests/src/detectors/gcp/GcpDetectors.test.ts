import { gcpDetector } from "../../../../src/detectors/gcp/GcpDetector";
import { mocked } from "ts-jest/utils";
import { gcpDetector as otelGCPDetector } from '@opentelemetry/resource-detector-gcp';
import { Resource } from "@opentelemetry/resources";
const { SemanticResourceAttributes } =require( "@opentelemetry/semantic-conventions");

jest.mock("@opentelemetry/resource-detector-gcp")

beforeEach(() => {
    mocked(otelGCPDetector.detect).mockClear();
})

describe("GCP Detectors", () => {
    it('should return empty resource if GCP not detected', async () => {

        mocked(otelGCPDetector.detect).mockImplementation((): Promise<any> => {
            return Promise.reject({})
        })

        const resource = await gcpDetector.detect();
        expect(resource).toEqual(Resource.empty());
    })

    it('should return GCP resource if detected', async () => {

        const expectedResource = new Resource({
           
                [SemanticResourceAttributes.CLOUD_ACCOUNT_ID]: "mycompany.com:api-project-123456789012",
                [SemanticResourceAttributes.CLOUD_AVAILABILITY_ZONE]: "asia-south1-c",
                [SemanticResourceAttributes.HOST_ID]: "1234567890123456789",
                [SemanticResourceAttributes.CLOUD_PROVIDER]: "gcp"
            
        })

        mocked(otelGCPDetector.detect).mockImplementation((): Promise<any> => {
            return Promise.resolve(expectedResource)
        })

        const resource = await gcpDetector.detect()

        expect(resource).toEqual(expectedResource)
    })

})
