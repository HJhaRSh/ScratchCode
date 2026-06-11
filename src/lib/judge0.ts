const JUDGE0_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_KEY = process.env.JUDGE0_API_KEY;

export interface TestCase {
  input: string;
  expected_output: string;
}

export interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  runtime: string;
  memory: string;
  error: string | null;
}

export async function runTestCase(
  code: string,
  languageId: number,
  testCase: TestCase
): Promise<TestResult> {
  // Submit to Judge0
  const submitResponse = await fetch(`${JUDGE0_URL}/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': JUDGE0_KEY || '',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    },
    body: JSON.stringify({
      source_code: btoa(code),
      language_id: languageId,
      stdin: btoa(testCase.input),
      expected_output: btoa(testCase.expected_output),
      base64_encoded: true,
      wait: false
    })
  });

  const { token } = await submitResponse.json();

  // Poll for result
  let result;
  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 800));
    const pollResponse = await fetch(
      `${JUDGE0_URL}/submissions/${token}?base64_encoded=true`,
      { headers: { 'X-RapidAPI-Key': JUDGE0_KEY || '' } }
    );
    result = await pollResponse.json();
    if (result.status?.id > 2) break; // not In Queue or Processing
  }

  const stdout = result.stdout
    ? atob(result.stdout).trim()
    : '';
  const expected = testCase.expected_output.trim();
  const passed = stdout === expected && result.status?.id === 3;

  return {
    passed,
    input: testCase.input,
    expected,
    actual: stdout || (result.stderr ? atob(result.stderr) : 'No output'),
    runtime: result.time || '0',
    memory: result.memory || '0',
    error: result.compile_output
      ? atob(result.compile_output) : null
  };
}

export async function runAllTestCases(
  code: string,
  languageId: number,
  testCases: TestCase[]
): Promise<TestResult[]> {
  // Run first 3 sequentially for fast feedback
  // Run remaining in parallel
  const first3 = await Promise.all(
    testCases.slice(0, 3).map(tc =>
      runTestCase(code, languageId, tc)
    )
  );
  const rest = await Promise.all(
    testCases.slice(3).map(tc =>
      runTestCase(code, languageId, tc)
    )
  );
  return [...first3, ...rest];
}
