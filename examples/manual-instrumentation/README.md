# Manual Instrumentation example for lm-telemetry-sdk-nodejs

## Overview
This example shows how to use [@logicmonitor/lm-telemetry-sdk](https://github.com/logicmonitor/lm-telemetry-sdk-nodejs) with a manually instrumented application. You can use any exporter that Opentelemetry supports. In this example we are using this exporter: [@opentelemetry/exporter-trace-otlp-http](https://www.npmjs.com/package/@opentelemetry/exporter-trace-otlp-http)
## Prerequisites

### Set a GitHub Personal Access Token to get lm-telemetry-sdk-nodejs from GitHub Package registry
- Generate a personal access token for your github account with `repo` and `read:packages` scope. [Follow these steps](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- Set your generated token as `GH_PAT` environment variable

### Install the dependencies
- From within this folder run, 
```bash
npm i
```
### Make sure to configure your backend in `tracing.js`

```node
const exporter = new OTLPTraceExporter({
	url: '<Your Backend URL>',
	headers: {}, // an optional object containing custom headers to be sent
});
```

If you are exporting directly to the LogicMonitor platform, assuming your company name is `mycompany` and your Bearer token is `N2dDODRpZks5M3ZoMkRhdXB4cG06WnlKQStSbmEzMXRXVlBCT0lHQ05GZz09`, your config would be:

```node
const exporter = new OTLPTraceExporter({
	url: 'https://mycompany.logicmonitor.com/rest/api/v1/traces',
	headers: {
	    Authorization: 'Bearer N2dDODRpZks5M3ZoMkRhdXB4cG06WnlKQStSbmEzMXRXVlBCT0lHQ05GZz09'
	},
});
```

## Running the application

Command:
```bash
node app.js
```

Visit `http://localhost:8080` in your browser or run a curl command in your terminal: `curl localhost:8080`

If this application is running on any of the supported backend for resource detection, you should see the traces in your portal with the detected resources populated.
If you are running this example on your local machine, then also you should see traces in your portal without the detected resources.
