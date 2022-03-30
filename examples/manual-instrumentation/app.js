const initTracing = require('./tracing');
const opentelemetry = require('@opentelemetry/api');

initTracing().then(() => {
	const tracer = opentelemetry.trace.getTracer('default');
	const parentSpan = tracer.startSpan('parentSpan');
	parentSpan.setAttribute('testEnv', 'true');
	console.log('Ending parent span');
	parentSpan.end();
});
