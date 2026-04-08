#!/usr/bin/env node
import process from 'node:process';
import { createRequire } from 'node:module';

const require = createRequire('/home/zzc/.npm-global/lib/node_modules/openclaw/package.json');
const { fetch, EnvHttpProxyAgent, ProxyAgent } = require('undici');

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.https_proxy || process.env.http_proxy;
const baseUrl = (process.env.GOOGLE_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/+$/, '');
const model = process.env.GOOGLE_IMAGE_MODEL || 'gemini-3-flash-preview';
const prompt = process.argv.slice(2).join(' ') || 'A minimal proxy debugging illustration';
const url = `${baseUrl}/models/${model}:generateContent`;

if (!apiKey) {
  console.error('Missing GEMINI_API_KEY or GOOGLE_API_KEY');
  process.exit(2);
}

const body = {
  contents: [{ role: 'user', parts: [{ text: prompt }] }],
  generationConfig: {
    responseModalities: ['TEXT', 'IMAGE']
  }
};

function short(s, n = 800) {
  if (typeof s !== 'string') return s;
  return s.length > n ? s.slice(0, n) + '…' : s;
}

async function runCase(name, dispatcherFactory) {
  const started = Date.now();
  let dispatcher;
  try {
    dispatcher = dispatcherFactory?.();
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(body),
      dispatcher,
      signal: AbortSignal.timeout(30000)
    });
    const elapsed = Date.now() - started;
    const text = await res.text();
    let imagePartCount = 0;
    try {
      const json = JSON.parse(text);
      imagePartCount = (json.candidates || [])
        .flatMap(c => c?.content?.parts || [])
        .filter(p => p?.inlineData?.data || p?.inline_data?.data).length;
    } catch {}
    return {
      name,
      ok: true,
      elapsedMs: elapsed,
      status: res.status,
      statusText: res.statusText,
      imagePartCount,
      bodyPreview: short(text, 2000)
    };
  } catch (err) {
    const elapsed = Date.now() - started;
    return {
      name,
      ok: false,
      elapsedMs: elapsed,
      errorName: err?.name,
      errorMessage: err?.message,
      causeName: err?.cause?.name,
      causeCode: err?.cause?.code,
      causeMessage: err?.cause?.message
    };
  } finally {
    try { await dispatcher?.close?.(); } catch {}
    try { await dispatcher?.destroy?.(); } catch {}
  }
}

async function main() {
  console.log('=== debug-google-image-proxy-paths ===');
  console.log('node', process.version);
  console.log('url', url);
  console.log('proxyUrl', proxyUrl || '(none)');

  const cases = [
    ['direct', () => undefined],
    ['env-proxy', () => new EnvHttpProxyAgent()],
    ...(proxyUrl ? [['explicit-proxy', () => new ProxyAgent(proxyUrl)]] : [])
  ];

  for (const [name, factory] of cases) {
    const result = await runCase(name, factory);
    console.log('\nCASE', name);
    console.log(JSON.stringify(result, null, 2));
  }
}

main();
