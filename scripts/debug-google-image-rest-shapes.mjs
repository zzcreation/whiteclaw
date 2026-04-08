#!/usr/bin/env node
import process from 'node:process';
import { createRequire } from 'node:module';

const require = createRequire('/home/zzc/.npm-global/lib/node_modules/openclaw/package.json');
const { fetch, EnvHttpProxyAgent } = require('undici');

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const baseUrl = (process.env.GOOGLE_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/+$/, '');
const model = process.env.GOOGLE_IMAGE_MODEL || 'gemini-3-pro-image-preview';
const prompt = process.argv.slice(2).join(' ') || 'A clean infographic poster about debugging network proxies';

if (!apiKey) {
  console.error('Missing GEMINI_API_KEY or GOOGLE_API_KEY');
  process.exit(2);
}

const bodies = [
  {
    name: 'openclaw-current-shape',
    body: {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE']
      }
    }
  },
  {
    name: 'google-doc-shape-imageConfig-no-responseModalities',
    body: {
      contents: prompt,
      generationConfig: {
        imageConfig: { aspectRatio: '1:1' }
      }
    }
  },
  {
    name: 'google-doc-shape-imageConfig-16x9',
    body: {
      contents: prompt,
      generationConfig: {
        imageConfig: { aspectRatio: '16:9', imageSize: '1K' }
      }
    }
  },
  {
    name: 'string-contents-plus-responseModalities',
    body: {
      contents: prompt,
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE']
      }
    }
  }
];

async function testCase(name, body) {
  const url = `${baseUrl}/models/${model}:generateContent`;
  const dispatcher = new EnvHttpProxyAgent();
  const started = Date.now();
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(body),
      dispatcher,
      signal: AbortSignal.timeout(60000)
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
    return { name, status: res.status, elapsedMs: Date.now()-started, imageParts, textParts, bodyPreview: text.slice(0, 1200) };
  } catch (err) {
    return { name, elapsedMs: Date.now()-started, errorName: err?.name, errorMessage: err?.message, causeCode: err?.cause?.code, causeMessage: err?.cause?.message };
  } finally {
    try { await dispatcher.close?.(); } catch {}
    try { await dispatcher.destroy?.(); } catch {}
  }
}

const main = async () => {
  console.log('=== debug-google-image-rest-shapes ===');
  console.log('model', model);
  for (const item of bodies) {
    const result = await testCase(item.name, item.body);
    console.log('\nCASE', item.name);
    console.log(JSON.stringify(result, null, 2));
  }
};

main();
