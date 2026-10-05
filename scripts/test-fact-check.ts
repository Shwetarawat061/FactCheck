/**
 * scripts/test-fact-check.ts
 *
 * Verification test script for /api/fact-check endpoint.
 * Validates that the endpoint returns compliant JSON matching the FactCheckResultData schema.
 *
 * Usage:
 *   npx tsx scripts/test-fact-check.ts [optional_url]
 *   npm run test:api
 */

const BASE_URL = process.argv[2] || process.env.TEST_URL || 'http://localhost:3000';
const VERDICTS = ['TRUE', 'MOSTLY TRUE', 'MIXED', 'MOSTLY FALSE', 'FALSE', 'UNVERIFIED'];
const RELATIONSHIPS = ['SUPPORTS', 'CONTRADICTS', 'CONTEXT'];

interface SchemaValidationReport {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

function validateSchema(data: any): SchemaValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  const isStr = (v: any): boolean => typeof v === 'string';
  const isNum = (v: any): boolean => typeof v === 'number' && Number.isFinite(v);

  // 1. Root Object Check
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { passed: false, errors: ['Root response is not a valid JSON object.'], warnings };
  }

  // 2. Demo Check
  if (data.isDemo === true) {
    errors.push('isDemo is set to true (real verification data required).');
  }

  // 3. Status Check
  if (!['ok', 'inconclusive'].includes(data.status)) {
    errors.push(`Invalid status "${data.status}". Expected "ok" or "inconclusive".`);
  }

  // 4. Verdict Check
  if (!VERDICTS.includes(data.verdict)) {
    errors.push(`Invalid verdict "${data.verdict}". Expected one of: ${VERDICTS.join(', ')}.`);
  }

  // 5. Core String Fields
  const requiredStrings = ['id', 'claim', 'summary', 'analysis', 'checkedAt'];
  for (const field of requiredStrings) {
    if (!isStr(data[field])) {
      errors.push(`Missing or non-string field "${field}" (type: ${typeof data[field]}).`);
    } else if (data[field].trim().length === 0 && field !== 'checkedAt') {
      errors.push(`String field "${field}" is empty.`);
    }
  }

  // 6. Confidence & Structure
  if (!isNum(data.confidence)) {
    errors.push(`Confidence is not a finite number (received: ${data.confidence}).`);
  } else if (data.confidence < 0 || data.confidence > 100) {
    warnings.push(`Confidence ${data.confidence} is outside standard 0-100 range.`);
  }

  if (!Array.isArray(data.reasoning)) {
    errors.push('Field "reasoning" is not an Array.');
  } else {
    data.reasoning.forEach((r: any, idx: number) => {
      if (!r || typeof r !== 'object') {
        errors.push(`Reasoning step [${idx}] is not an object.`);
      } else {
        if (!isStr(r.index)) errors.push(`Reasoning step [${idx}].index is not a string.`);
        if (!isStr(r.title)) errors.push(`Reasoning step [${idx}].title is not a string.`);
        if (!isStr(r.description)) errors.push(`Reasoning step [${idx}].description is not a string.`);
      }
    });
  }

  // 7. Evidence Items
  if (!Array.isArray(data.evidence)) {
    errors.push('Field "evidence" is not an Array.');
  } else {
    data.evidence.forEach((e: any, idx: number) => {
      if (!e || typeof e !== 'object') {
        errors.push(`Evidence item [${idx}] is not an object.`);
        return;
      }

      const strFields = ['id', 'source', 'title', 'url', 'quote', 'date'];
      for (const f of strFields) {
        if (!isStr(e[f])) {
          errors.push(`Evidence [${idx}].${f} is not a string.`);
        }
      }

      if (!RELATIONSHIPS.includes(e.relationship)) {
        errors.push(`Evidence [${idx}].relationship "${e.relationship}" invalid. Expected: ${RELATIONSHIPS.join(', ')}.`);
      }

      if (!isNum(e.credibilityScore)) {
        errors.push(`Evidence [${idx}].credibilityScore is not a number.`);
      }

      if (typeof e.urlReachable !== 'boolean') {
        errors.push(`Evidence [${idx}].urlReachable is not a boolean.`);
      }

      if (typeof e.url === 'string' && !/^https?:\/\//i.test(e.url)) {
        errors.push(`Evidence [${idx}].url "${e.url}" is not a valid absolute HTTP/HTTPS URL.`);
      }
    });
  }

  // 8. Evidence Counts Reconciliation
  if (Array.isArray(data.evidence)) {
    const total = data.evidence.length;
    const supports = data.evidence.filter((e: any) => e.relationship === 'SUPPORTS').length;
    const contradicts = data.evidence.filter((e: any) => e.relationship === 'CONTRADICTS').length;
    const context = data.evidence.filter((e: any) => e.relationship === 'CONTEXT').length;

    const ov = data.evidenceOverview;
    if (!ov || typeof ov !== 'object') {
      errors.push('Missing or invalid "evidenceOverview" object.');
    } else {
      if (ov.total !== total) {
        errors.push(`evidenceOverview.total mismatch: expected ${total}, got ${ov.total}.`);
      }
      if (ov.supports !== supports) {
        errors.push(`evidenceOverview.supports mismatch: expected ${supports}, got ${ov.supports}.`);
      }
      if (ov.contradicts !== contradicts) {
        errors.push(`evidenceOverview.contradicts mismatch: expected ${contradicts}, got ${ov.contradicts}.`);
      }
      if (ov.context !== context) {
        errors.push(`evidenceOverview.context mismatch: expected ${context}, got ${ov.context}.`);
      }
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

async function runTests() {
  console.log(`\n======================================================`);
  console.log(` FactCheckAI /api/fact-check Schema & Endpoint Test`);
  console.log(` Target Server: ${BASE_URL}`);
  console.log(`======================================================\n`);

  let allPassed = true;

  // -----------------------------------------------------------
  // TEST 1: Health Check Endpoint
  // -----------------------------------------------------------
  console.log(`[TEST 1] GET /api/health ...`);
  try {
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthText = await healthRes.text();
    console.log(`  HTTP Status: ${healthRes.status}`);
    console.log(`  Content-Type: ${healthRes.headers.get('content-type')}`);
    try {
      const healthJson = JSON.parse(healthText);
      console.log(`  Response JSON:`, healthJson);
      if (healthJson.configured) {
        console.log(`  \x1b[32m✔ Health check passed (GEMINI_API_KEY is configured).\x1b[0m\n`);
      } else {
        console.log(`  \x1b[33m⚠ Health check passed but GEMINI_API_KEY is not set.\x1b[0m\n`);
      }
    } catch {
      console.log(`  \x1b[31m✖ Health check returned non-JSON:\x1b[0m ${healthText.slice(0, 100)}\n`);
      allPassed = false;
    }
  } catch (err: any) {
    console.log(`  \x1b[31m✖ Failed to connect to server: ${err.message}\x1b[0m\n`);
    process.exit(1);
  }

  // -----------------------------------------------------------
  // TEST 2: GET /api/fact-check (Should return JSON 405, NOT HTML)
  // -----------------------------------------------------------
  console.log(`[TEST 2] GET /api/fact-check (Verify no HTML fallback) ...`);
  try {
    const getRes = await fetch(`${BASE_URL}/api/fact-check`);
    const getText = await getRes.text();
    const contentType = getRes.headers.get('content-type') || '';
    console.log(`  HTTP Status: ${getRes.status}`);
    console.log(`  Content-Type: ${contentType}`);
    
    if (contentType.includes('text/html') || getText.startsWith('<!doctype') || getText.startsWith('<html')) {
      console.log(`  \x1b[31m✖ ERROR: GET /api/fact-check returned an HTML page instead of JSON!\x1b[0m`);
      console.log(`  This triggers "Malformed server response" on client redirects.\n`);
      allPassed = false;
    } else {
      try {
        const json = JSON.parse(getText);
        console.log(`  JSON response:`, json);
        console.log(`  \x1b[32m✔ Correctly handled as JSON API (status ${getRes.status}).\x1b[0m\n`);
      } catch {
        console.log(`  \x1b[31m✖ Failed to parse JSON:\x1b[0m ${getText.slice(0, 100)}\n`);
        allPassed = false;
      }
    }
  } catch (err: any) {
    console.log(`  \x1b[31m✖ Request failed: ${err.message}\x1b[0m\n`);
    allPassed = false;
  }

  // -----------------------------------------------------------
  // TEST 3: POST /api/fact-check with live claim
  // -----------------------------------------------------------
  const testClaim = "Water boils at 100C at sea level";
  console.log(`[TEST 3] POST /api/fact-check`);
  console.log(`  Claim: "${testClaim}" ...`);
  
  const startTime = Date.now();
  try {
    const postRes = await fetch(`${BASE_URL}/api/fact-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ claim: testClaim }),
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const rawText = await postRes.text();
    const contentType = postRes.headers.get('content-type') || '';

    console.log(`  Elapsed: ${elapsed}s`);
    console.log(`  HTTP Status: ${postRes.status}`);
    console.log(`  Content-Type: ${contentType}`);

    // Check if response is HTML
    if (contentType.includes('text/html') || rawText.startsWith('<!doctype') || rawText.startsWith('<html')) {
      console.log(`  \x1b[31m✖ FATAL: Endpoint returned HTML instead of JSON!\x1b[0m`);
      console.log(`  First 200 chars: ${rawText.slice(0, 200)}\n`);
      allPassed = false;
      return;
    }

    let parsedJson: any = null;
    try {
      parsedJson = JSON.parse(rawText);
    } catch (parseErr: any) {
      console.log(`  \x1b[31m✖ FATAL: Failed to parse response as JSON (${parseErr.message})\x1b[0m`);
      console.log(`  Raw response: ${rawText.slice(0, 300)}\n`);
      allPassed = false;
      return;
    }

    // Validate response schema
    console.log(`\n  --- Schema Field Validation ---`);
    const validation = validateSchema(parsedJson);

    if (validation.passed) {
      console.log(`  \x1b[32m✔ Verdict: ${parsedJson.verdict}\x1b[0m`);
      console.log(`  \x1b[32m✔ Status: ${parsedJson.status}\x1b[0m`);
      console.log(`  \x1b[32m✔ Confidence: ${parsedJson.confidence}%\x1b[0m`);
      console.log(`  \x1b[32m✔ Evidence Items: ${parsedJson.evidence?.length}\x1b[0m`);
      console.log(`  \x1b[32m✔ Overview: Supports=${parsedJson.evidenceOverview?.supports}, Contradicts=${parsedJson.evidenceOverview?.contradicts}, Context=${parsedJson.evidenceOverview?.context}\x1b[0m`);
      console.log(`  \x1b[32m✔ ALL SCHEMA CONSTRAINTS PASSED PERFECTLY!\x1b[0m\n`);
    } else {
      console.log(`  \x1b[31m✖ SCHEMA VALIDATION FAILED with ${validation.errors.length} error(s):\x1b[0m`);
      validation.errors.forEach(err => console.log(`    - ${err}`));
      allPassed = false;
    }

    if (validation.warnings.length > 0) {
      console.log(`  \x1b[33mWarnings:\x1b[0m`);
      validation.warnings.forEach(w => console.log(`    - ${w}`));
    }

    // Print sample of evidence
    if (Array.isArray(parsedJson.evidence) && parsedJson.evidence.length > 0) {
      console.log(`  Sample Verified Evidence [0]:`);
      const sample = parsedJson.evidence[0];
      console.log(`    - Source: ${sample.source}`);
      console.log(`    - Relationship: ${sample.relationship}`);
      console.log(`    - URL: ${sample.url}`);
      console.log(`    - Reachable: ${sample.urlReachable}`);
      console.log(`    - Excerpt: "${sample.quote?.slice(0, 80)}..."\n`);
    }

  } catch (err: any) {
    console.log(`  \x1b[31m✖ Request failed: ${err.message}\x1b[0m\n`);
    allPassed = false;
  }

  // -----------------------------------------------------------
  // Summary
  // -----------------------------------------------------------
  console.log(`======================================================`);
  if (allPassed) {
    console.log(` \x1b[32mTEST RESULT: ALL TESTS PASSED SUCCESSFULLY! \x1b[0m`);
    console.log(` The backend produces valid JSON conforming to FactCheckResultData.`);
    console.log(`======================================================\n`);
    process.exit(0);
  } else {
    console.log(` \x1b[31mTEST RESULT: TESTS FAILED \x1b[0m`);
    console.log(` See errors above to pinpoint if failure is schema or transmission.`);
    console.log(`======================================================\n`);
    process.exit(1);
  }
}

runTests();
