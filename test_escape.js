const workerScript = `
  const traceScript = \`
    return STDIN_DATA + "\\\\\\\\n"
  \`;
  console.log(JSON.stringify(traceScript));
`;
eval(workerScript);
