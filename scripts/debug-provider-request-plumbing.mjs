#!/usr/bin/env node
import { pathToFileURL } from 'node:url';

const root = '/home/zzc/.npm-global/lib/node_modules/openclaw/dist';

async function main() {
  const providerRequest = await import(pathToFileURL(`${root}/provider-request-config-0I1kx7Qd.js`).href);
  const shared = await import(pathToFileURL(`${root}/shared-bNb64sx7.js`).href);
  const googleImage = await import(pathToFileURL(`${root}/extensions/google/image-generation-provider.js`).href);

  const cfg = {
    models: {
      providers: {
        google: {
          baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
          request: {
            proxy: {
              mode: 'env-proxy'
            },
            headers: {
              'x-debug-plumbing': '1'
            }
          }
        }
      }
    }
  };

  const directResolve = providerRequest.i({
    provider: 'google',
    api: 'google-generative-ai',
    baseUrl: cfg.models.providers.google.baseUrl,
    providerHeaders: { 'x-provider': 'yes' },
    request: cfg.models.providers.google.request,
    capability: 'image',
    transport: 'http'
  });

  const httpResolve = shared.o({
    baseUrl: cfg.models.providers.google.baseUrl,
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    defaultHeaders: { 'x-default': 'yes' },
    provider: 'google',
    api: 'google-generative-ai',
    capability: 'image',
    transport: 'http',
    request: cfg.models.providers.google.request
  });

  const provider = googleImage.buildGoogleImageGenerationProvider();

  console.log('=== direct resolveProviderRequestConfig ===');
  console.log(JSON.stringify({
    baseUrl: directResolve.baseUrl,
    headers: directResolve.headers,
    proxy: directResolve.proxy,
    tls: directResolve.tls,
    policy: directResolve.policy
  }, null, 2));

  console.log('\n=== resolveProviderHttpRequestConfig ===');
  console.log(JSON.stringify({
    baseUrl: httpResolve.baseUrl,
    headers: Object.fromEntries(httpResolve.headers.entries()),
    allowPrivateNetwork: httpResolve.allowPrivateNetwork,
    dispatcherPolicy: httpResolve.dispatcherPolicy,
    requestConfig: {
      proxy: httpResolve.requestConfig?.proxy,
      tls: httpResolve.requestConfig?.tls,
      policy: httpResolve.requestConfig?.policy
    }
  }, null, 2));

  console.log('\n=== provider metadata ===');
  console.log(JSON.stringify({
    id: provider.id,
    defaultModel: provider.defaultModel,
    models: provider.models,
    generateCaps: provider.capabilities?.generate,
    editCaps: provider.capabilities?.edit
  }, null, 2));

  console.log('\n=== conclusion ===');
  console.log('If proxy.mode=env-proxy appears above in directResolve/httpResolve, then static provider request plumbing is real at the resolver layer.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
