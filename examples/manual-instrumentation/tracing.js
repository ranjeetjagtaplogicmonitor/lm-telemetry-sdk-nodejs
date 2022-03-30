const { lmResourceDetector } = require('@logicmonitor/lm-telemetry-sdk');
const {
	OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-http');
const {
	BasicTracerProvider,
	SimpleSpanProcessor,
} = require('@opentelemetry/sdk-trace-base');
const { detectResources } = require('@opentelemetry/resources');
const exporter = new OTLPTraceExporter({
	url: '<Your backend URL>',
	headers: {}, // an optional object containing custom headers to be sent
});

module.exports = async function () {
	const provider = new BasicTracerProvider();
	const detectedResource = await detectResources({
		detectors: [lmResourceDetector],
	});
	console.log('Resource: ', detectedResource);
	provider.resource = detectedResource;
	provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
	provider.register();
	console.log('Tracing Initialized');
};
