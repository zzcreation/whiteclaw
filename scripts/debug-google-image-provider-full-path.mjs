#!/usr/bin/env node
import { pathToFileURL } from 'node:url';

const root = '/home/zzc/.npm-global/lib/node_modules/openclaw/dist';

async function main() {
  const shared = await import(pathToFileURL(`${root}/shared-bNb64sx7.js`).href);
  const api = await import(pathToFileURL(`${root}/api-tF_YSNoD.js`).href);

  const cfg = {
    models: {
      providers: {
        google: {
          baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
          request: {
            proxy: { mode: 'env-proxy' },
            headers: { 'x-debug-full-path': '1' }
          }
        }
      }
    }
  };

  const resolveGoogleBaseUrl = (cfg) => api.a(cfg?.models?.providers?.google?.baseUrl);

  const result = shared.o({
    baseUrl: resolveGoogleBaseUrl(cfg),
    defaultBaseUrl: api.t,
    allowPrivateNetwork: Boolean(cfg?.models?.providers?.google?.baseUrl?.trim()),
    defaultHeaders: { 'x-goog-api-key': 'fake-key-for-plumbing-check' },
    provider: 'google',
    api: 'google-generative-ai',
    capability: 'image',
    transport: 'http',
    request: cfg?.models?.providers?.google?.request
  });

  console.log('=== simulated google image provider path ===');
  console.log(JSON.stringify({
    inputCfgRequest: cfg.models.providers.google.request,
    resolvedBaseUrl: result.baseUrl,
    resolvedHeaders: Object.fromEntries(result.headers.entries()),
    allowPrivateNetwork: result.allowPrivateNetwork,
    dispatcherPolicy: result.dispatcherPolicy,
    requestConfig: {
      proxy: result.requestConfig?.proxy,
      tls: result.requestConfig?.tls,
      policy: result.requestConfig?.policy
    }
  }, null, 2));

  const ok = result.dispatcherPolicy?.mode === 'env-proxy' && result.requestConfig?.proxy?.mode === 'env-proxy';
  console.log('\n=== verdict ===');
  console.log(ok
    ? 'PASS: cfg.models.providers.google.request propagated to dispatcherPolicy in the simulated google image provider path.'
    : 'FAIL: cfg.models.providers.google.request did not propagate as expected.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
