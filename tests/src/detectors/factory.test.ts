import { detectorFactory } from '../../../src/detectors/factory';

describe('factory', () => {

    it('should be defined', () => {
        expect(detectorFactory).toBeDefined();
    });

    it('should add all detectors if no detector specified in ENV', () => {
        const detectors = detectorFactory.getDetectors();
        expect(detectors.length).toBe(5);
    });

    it('should add only specified detector if specified in ENV', () => {
        process.env.LM_RESOURCE_DETECTOR = 'aws_ec2';
        const detectors = detectorFactory.getDetectors();
        expect(detectors.length).toBe(1);
    });

    it('should add all detectors if undefined detector specified in ENV', () => {
        process.env.LM_RESOURCE_DETECTOR = "undefined";
        const detectors = detectorFactory.getDetectors();
        expect(detectors.length).toBe(5);
    });

})



