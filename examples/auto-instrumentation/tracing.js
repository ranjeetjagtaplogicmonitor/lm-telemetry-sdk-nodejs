const opentelemetry = require('@opentelemetry/sdk-node');
const {
	getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { lmResourceDetector } = require('@logicmonitor/lm-telemetry-sdk');
const {
	OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-http');

const exporter = new OTLPTraceExporter({
	url: '<Your Backend URL>',
	headers: {}, // an optional object containing custom headers to be sent
});

const sdk = new opentelemetry.NodeSDK({
	traceExporter: exporter,
	instrumentations: [getNodeAutoInstrumentations()],
});

module.exports = async function () {
	await sdk.detectResources({
		detectors: [lmResourceDetector],
	});
	await sdk.start();
	console.log('Tracing Initialized');
};
