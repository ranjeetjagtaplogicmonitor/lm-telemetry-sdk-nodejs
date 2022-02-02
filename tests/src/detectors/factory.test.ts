import { detectorFactory } from '../../../src/detectors/factory';

describe('factory', () => {
	it('should be defined', () => {
		expect(detectorFactory).toBeDefined();
	});

	it('should add all detectors if no detector specified in ENV', () => {
		const detectors = detectorFactory.getDetectors();
		expect(detectors.length).toBe(6);
	});

	it('should add only EC2 detector if specified in ENV', () => {
		process.env.LM_RESOURCE_DETECTOR = 'aws_ec2';
		const detectors = detectorFactory.getDetectors();
		expect(detectors.length).toBe(1);
	});

	it('should add only ECS detector if specified in ENV', () => {
		process.env.LM_RESOURCE_DETECTOR = 'aws_ecs';
		const detectors = detectorFactory.getDetectors();
		expect(detectors.length).toBe(1);
	});

	it('should add only Lambda detector if specified in ENV', () => {
		process.env.LM_RESOURCE_DETECTOR = 'aws_lambda';
		const detectors = detectorFactory.getDetectors();
		expect(detectors.length).toBe(1);
	});

	it('should add only GCP detector if gcp_compute_engine specified in ENV', () => {
		process.env.LM_RESOURCE_DETECTOR = 'gcp_compute_engine';
		const detectors = detectorFactory.getDetectors();
		expect(detectors.length).toBe(1);
	});

	it('should add only GCP detector if gcp_kubernetes_engine specified in ENV', () => {
		process.env.LM_RESOURCE_DETECTOR = 'gcp_kubernetes_engine';
		const detectors = detectorFactory.getDetectors();
		expect(detectors.length).toBe(1);
	});

	it('should add only Cloud Functions detector if specified in ENV', () => {
		process.env.LM_RESOURCE_DETECTOR = 'gcp_cloud_functions';
		const detectors = detectorFactory.getDetectors();
		expect(detectors.length).toBe(1);
	});

	it('should add only Azure VM detector if specified in ENV', () => {
		process.env.LM_RESOURCE_DETECTOR = 'azure_vm';
		const detectors = detectorFactory.getDetectors();
		expect(detectors.length).toBe(1);
	});

	it('should add all detectors if undefined detector specified in ENV', () => {
		process.env.LM_RESOURCE_DETECTOR = 'undefined';
		const detectors = detectorFactory.getDetectors();
		expect(detectors.length).toBe(6);
	});
});
