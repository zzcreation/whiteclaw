#!/usr/bin/env node
import process from 'node:process';
import { createRequire } from 'node:module';

const require = createRequire('/home/zzc/.npm-global/lib/node_modules/openclaw/package.json');
const { fetch, EnvHttpProxyAgent } = require('undici');

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const baseUrl = (process.env.GOOGLE_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/+$/, '');
const models = [
  'gemini-3-flash-preview',
  'gemini-3.1-flash-image-preview',
  'gemini-3-pro-image-preview'
];
const prompt = process.argv.slice(2).join(' ') || 'A red paper airplane over blue mountains';

if (!apiKey) {
  console.error('Missing GEMINI_API_KEY or GOOGLE_API_KEY');
  process.exit(2);
}

async function testModel(model) {
  const url = `${baseUrl}/models/${model}:generateContent`;
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE']
    }
  };
  const started = Date.now();
  const dispatcher = new EnvHttpProxyAgent();
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(body),
      dispatcher,
      signal: AbortSignal.timeout(45000)
    });
    const text = await res.text();
    let imageParts = 0;
    let textParts = 0;
    try {
      const json = JSON.parse(text);
      const parts = (json.candidates || []).flatMap(c => c?.content?.parts || []);
      imageParts = parts.filter(p => p?.inlineData?.data || p?.inline_data?.data).length;
      textParts = parts.filter(p => typeof p?.text === 'string' && p.text.trim()).length;
    } catch {}
    return { model, elapsedMs: Date.now() - started, status: res.status, imageParts, textParts, bodyPreview: text.slice(0, 1200) };
  } catch (err) {
    return { model, elapsedMs: Date.now() - started, errorName: err?.name, errorMessage: err?.message, causeCode: err?.cause?.code, causeMessage: err?.cause?.message };
  } finally {
    try { await dispatcher.close?.(); } catch {}
    try { await dispatcher.destroy?.(); } catch {}
  }
}

const main = async () => {
  console.log('=== debug-google-image-models ===');
  for (const model of models) {
    const result = await testModel(model);
    console.log('\nMODEL', model);
    console.log(JSON.stringify(result, null, 2));
  }
};

main();
