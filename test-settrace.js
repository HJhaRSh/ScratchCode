const fs = require('fs');

const html = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://skulpt.org/js/skulpt.min.js"></script>
  <script src="https://skulpt.org/js/skulpt-stdlib.js"></script>
</head>
<body>
  <script>
    function outf(text) { console.log("OUT:", text); }
    function builtinRead(x) {
      if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
      return Sk.builtinFiles["files"][x];
    }
    
    Sk.configure({output:outf, read:builtinRead});
    
    const code = \`
import sys

def trace_calls(frame, event, arg):
    print("TRACE:", event, frame.f_lineno)
    return trace_calls

sys.settrace(trace_calls)

x = 1
y = 2
print(x+y)
\`;
    
    Sk.misceval.asyncToPromise(() => {
        return Sk.importMainWithBody("<stdin>", false, code, true);
    }).then(() => console.log("Done")).catch(e => console.error(e));
  </script>
</body>
</html>
`;
fs.writeFileSync('test.html', html);
