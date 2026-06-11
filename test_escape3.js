const workerScript = `
  const traceScript = \`
    return STDIN_DATA + "\\n"
  \`;
  const pythonScript = traceScript;
  console.log("Python script string:\\n", pythonScript);
`;
eval(workerScript);
