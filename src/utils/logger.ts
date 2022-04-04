import { diag } from '@opentelemetry/api';

export const cLogger = diag.createComponentLogger({
	namespace: '@logicmonitor/lm-telemetry-sdk',
});
