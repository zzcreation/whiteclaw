#!/usr/bin/env node
import process from 'node:process';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const baseUrl = (process.env.GOOGLE_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/+$/, '');
const model = process.env.GOOGLE_IMAGE_MODEL || 'gemini-3-flash-preview';
const prompt = process.argv.slice(2).join(' ') || 'A tiny blue robot debugging network requests, flat illustration';

if (!apiKey) {
  console.error('Missing GEMINI_API_KEY or GOOGLE_API_KEY');
  process.exit(2);
}

const url = `${baseUrl}/models/${model}:generateContent`;
const body = {
  contents: [
    {
      role: 'user',
      parts: [{ text: prompt }]
    }
  ],
  generationConfig: {
    responseModalities: ['TEXT', 'IMAGE'],
    imageConfig: { aspectRatio: '1:1' }
  }
};

function short(s, n = 500) {
  if (typeof s !== 'string') return s;
  return s.length > n ? s.slice(0, n) + '…' : s;
}

async function main() {
  console.log('=== debug-google-image-generate ===');
  console.log('node', process.version);
  console.log('url', url);
  console.log('http_proxy', process.env.HTTP_PROXY || '');
  console.log('https_proxy', process.env.HTTPS_PROXY || '');
  console.log('no_proxy', process.env.NO_PROXY || '');
  console.log('apiKeyPrefix', apiKey.slice(0, 8) + '...');
  console.log('prompt', prompt);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60000)
    });

    console.log('status', res.status, res.statusText);
    console.log('headers', Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log('body', short(text, 4000));

    try {
      const json = JSON.parse(text);
      const parts = (json.candidates || []).flatMap(c => c?.content?.parts || []);
      const imageParts = parts.filter(p => p?.inlineData?.data || p?.inline_data?.data);
      console.log('candidateCount', (json.candidates || []).length);
      console.log('imagePartCount', imageParts.length);
    } catch {}
  } catch (err) {
    console.log('ERROR_NAME', err?.name);
    console.log('ERROR_MESSAGE', err?.message);
    console.log('ERROR_STACK', short(err?.stack || '', 4000));
    if (err?.cause) {
      console.log('CAUSE_NAME', err.cause?.name);
      console.log('CAUSE_CODE', err.cause?.code);
      console.log('CAUSE_MESSAGE', err.cause?.message);
      console.log('CAUSE_STACK', short(err.cause?.stack || '', 4000));
      if (typeof err.cause === 'object') {
        const own = {};
        for (const k of Object.getOwnPropertyNames(err.cause)) own[k] = err.cause[k];
        console.log('CAUSE_PROPS', short(JSON.stringify(own, null, 2), 4000));
      }
    }
    process.exit(1);
  }
}

main();
