const fs = require('fs');

let content = fs.readFileSync('src/components/editor/CodeVisualizer.tsx', 'utf8');

// replace 1: Interfaces
content = content.replace(
`interface Step {
  step: number;
  line: number;
  variables: Record<string, VariableState>;
  callStack: string[];
  output: string;
  error?: string;
}`,
`interface FrameData {
  name: string;
  variables: Record<string, VariableState>;
}

interface Step {
  step: number;
  line: number;
  frames: FrameData[];
  callStack: string[];
  output: string;
  error?: string;
}`);

// replace 2: python trace script
content = content.replace(
`def _trace_calls(frame, event, arg):
    if event == "line":
        locs = frame.f_locals
        filtered_locs = {}
        for k, v in locs.items():
            if not k.startswith('_') and k not in ['sys', 'json', 'io', 'inspect']:
                type_name = type(v).__name__
                val = v
                if type_name == 'function':
                    try:
                        sig = inspect.signature(v)
                        val = f"{v.__name__}{sig}"
                    except Exception:
                        val = f"{v.__name__}()"
                elif type_name not in ['int', 'float', 'str', 'bool', 'list', 'dict', 'NoneType']:
                    val = f"<class '{type_name}'>"
                    type_name = 'other'
                
                filtered_locs[k] = {"type": type_name, "value": val}
                
        _trace_steps.append({
            "line": frame.f_lineno,
            "variables": filtered_locs,
            "output": _stdout_capture.getvalue()
        })
    return _trace_calls`,
`def _trace_calls(frame, event, arg):
    if event == "line":
        frames_list = []
        f = frame
        while f is not None:
            if f.f_code.co_name == "<module>" or not f.f_code.co_name.startswith('_'):
                locs = f.f_locals
                filtered_locs = {}
                for k, v in locs.items():
                    if not k.startswith('_') and k not in ['sys', 'json', 'io', 'inspect']:
                        type_name = type(v).__name__
                        val = v
                        if type_name == 'function':
                            try:
                                sig = inspect.signature(v)
                                val = f"{v.__name__}{sig}"
                            except Exception:
                                val = f"{v.__name__}()"
                        elif type_name == 'type':
                            class_dict = {}
                            for ck, cv in v.__dict__.items():
                                if not ck.startswith('__') or ck == '__init__':
                                    if type(cv).__name__ == 'function':
                                        try:
                                            sig = inspect.signature(cv)
                                            class_dict[ck] = f"function {cv.__name__}{sig}"
                                        except Exception:
                                            class_dict[ck] = f"function {cv.__name__}()"
                            type_name = 'class'
                            val = class_dict
                        elif type_name not in ['int', 'float', 'str', 'bool', 'list', 'dict', 'NoneType']:
                            if hasattr(v, '__dict__'):
                                obj_dict = {}
                                for ok, ov in v.__dict__.items():
                                    obj_dict[ok] = str(ov)
                                type_name = f"{type_name} instance"
                                val = obj_dict
                            else:
                                val = f"<class '{type_name}'>"
                                type_name = 'other'
                        
                        filtered_locs[k] = {"type": type_name, "value": val}
                
                name = "Global frame" if f.f_code.co_name == "<module>" else f.f_code.co_name
                frames_list.insert(0, {
                    "name": name,
                    "variables": filtered_locs
                })
            f = f.f_back
            
        _trace_steps.append({
            "line": frame.f_lineno,
            "frames": frames_list,
            "output": _stdout_capture.getvalue()
        })
    return _trace_calls`);

// replace 3: onmessage parsing
content = content.replace(
`         let processedSteps = steps.map((s: any, i: number) => {
            let processedVars: any = {};
            for (let [k, v] of Object.entries(s.variables)) {
                let typedV = v as any;
                let isChanged = false;
                if (prevVars[k] !== JSON.stringify(typedV.value)) {
                    isChanged = true;
                }
                processedVars[k] = { ...typedV, changed: isChanged };
                prevVars[k] = JSON.stringify(typedV.value);
            }
            return {
               step: i + 1,
               line: s.line,
               variables: processedVars,
               callStack: ["global"],
               output: s.output,
               error: s.error
            };
         });
         
         if (processedSteps.length === 0) {
             processedSteps = [{ step: 1, line: 1, variables: {}, callStack: ["global"], output: "" }];
         }`,
`         let processedSteps = steps.map((s: any, i: number) => {
            let processedFrames = (s.frames || []).map((fr: any) => {
               let processedVars: any = {};
               for (let [k, v] of Object.entries(fr.variables || {})) {
                   let typedV = v as any;
                   processedVars[k] = { ...typedV, changed: false }; 
               }
               return { name: fr.name, variables: processedVars };
            });
            return {
               step: i + 1,
               line: s.line,
               frames: processedFrames,
               callStack: ["global"],
               output: s.output,
               error: s.error
            };
         });
         
         if (processedSteps.length === 0) {
             processedSteps = [{ step: 1, line: 1, frames: [{ name: "Global frame", variables: {} }], callStack: ["global"], output: "" }];
         }`);

// replace 4: JS Stepper
content = content.replace(
`          traceSteps.push({
            step: traceSteps.length + 1,
            line: i + 1,
            variables: {},
            callStack: ["global"],
            output: outputBuffer
          });`,
`          traceSteps.push({
            step: traceSteps.length + 1,
            line: i + 1,
            frames: [{ name: "Global frame", variables: {} }],
            callStack: ["global"],
            output: outputBuffer
          });`);

// replace 5: allObjects computation
content = content.replace(
`  const codeLines = code.split('\\n');`,
`  const codeLines = code.split('\\n');
  
  const allObjects: { name: string, state: VariableState }[] = [];
  if (currentStep && currentStep.frames) {
    currentStep.frames.forEach(fr => {
      Object.entries(fr.variables).forEach(([name, state]) => {
        if (state.type === 'list' || state.type === 'dict' || state.type === 'function' || state.type === 'class' || state.type.endsWith('instance')) {
          allObjects.push({ name, state });
        }
      });
    });
  }`);

// replace 6: Frame and Object rendering
content = content.replace(
`                {/* Frames */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="bg-indigo-900/20 border border-indigo-500/30 rounded w-full shrink-0 relative flex flex-col">
                    <div className="text-sm font-bold border-b border-indigo-500/30 p-2 bg-indigo-500/10 text-indigo-200">Global frame</div>
                    <div className="p-3 flex flex-col gap-2">
                      {Object.keys(currentStep.variables).length === 0 ? (
                        <div className="text-slate-500 text-sm italic py-1">empty</div>
                      ) : (
                        Object.entries(currentStep.variables).map(([name, state]) => (
                          <div key={name} className="flex text-sm items-center">
                            <div className="w-20 text-right pr-3 text-slate-300 font-mono">{name}</div>
                            <div className="border border-white/10 bg-black/40 rounded px-2 py-1 flex-1 font-mono text-slate-200">
                              {state.type === 'list' || state.type === 'dict' || state.type === 'function' ? (
                                <span className="text-indigo-400 flex items-center h-full text-xs italic">pointer ➔</span>
                              ) : state.type === 'str' ? (
                                <span className="text-emerald-400">"{state.value}"</span>
                              ) : state.type === 'int' || state.type === 'float' ? (
                                <span className="text-blue-400">{state.value}</span>
                              ) : state.type === 'bool' ? (
                                <span className="text-purple-400">{String(state.value)}</span>
                              ) : (
                                String(state.value)
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Objects */}
                <div className="flex-1 flex flex-col gap-4">
                  {Object.entries(currentStep.variables).filter(([_, state]) => state.type === 'list' || state.type === 'dict' || state.type === 'function').map(([name, state], idx) => (
                    <div key={idx} className="bg-amber-900/10 border border-amber-500/30 rounded p-3 shrink-0">
                      <div className="text-xs text-amber-500/70 mb-2 font-mono font-bold">{state.type}</div>
                      <div className="flex flex-wrap bg-black/40 border border-white/10 rounded overflow-hidden">
                        {state.type === 'list' && Array.isArray(state.value) ? (
                          state.value.map((v: any, i: number) => (
                            <div key={i} className="flex flex-col border-r border-white/10 last:border-r-0 min-w-[2.5rem]">
                              <div className="bg-white/5 text-[10px] text-slate-500 text-center border-b border-white/10 p-0.5">{i}</div>
                              <div className="text-center p-1.5 font-mono text-sm text-slate-200">{JSON.stringify(v)}</div>
                            </div>
                          ))
                        ) : state.type === 'dict' && typeof state.value === 'object' && state.value !== null ? (
                          <div className="flex flex-col w-full">
                            {Object.entries(state.value).map(([k, v], i) => (
                              <div key={i} className="flex border-b border-white/10 last:border-b-0 w-full text-sm font-mono">
                                <div className="w-1/2 p-1.5 border-r border-white/10 bg-white/5 text-slate-400">{k}</div>
                                <div className="w-1/2 p-1.5 text-slate-200">{JSON.stringify(v)}</div>
                              </div>
                            ))}
                          </div>
                        ) : state.type === 'function' ? (
                          <div className="p-2 font-mono text-sm text-slate-200">{String(state.value)}</div>
                        ) : (
                          <div className="p-2 font-mono text-sm text-slate-200">{JSON.stringify(state.value)}</div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {Object.entries(currentStep.variables).filter(([_, state]) => state.type === 'list' || state.type === 'dict' || state.type === 'function').length === 0 && (
                    <div className="text-slate-500 text-sm italic text-center mt-4">No objects in heap</div>
                  )}
                </div>`,
`                {/* Frames */}
                <div className="flex-1 flex flex-col gap-4">
                  {(currentStep.frames || []).map((frame, fIdx) => (
                    <div key={fIdx} className="bg-indigo-900/20 border border-indigo-500/30 rounded w-full shrink-0 relative flex flex-col">
                      <div className="text-sm font-bold border-b border-indigo-500/30 p-2 bg-indigo-500/10 text-indigo-200">{frame.name}</div>
                      <div className="p-3 flex flex-col gap-2">
                        {Object.keys(frame.variables || {}).length === 0 ? (
                          <div className="text-slate-500 text-sm italic py-1">empty</div>
                        ) : (
                          Object.entries(frame.variables).map(([name, state]) => (
                            <div key={name} className="flex text-sm items-center">
                              <div className="w-20 text-right pr-3 text-slate-300 font-mono">{name}</div>
                              <div className="border border-white/10 bg-black/40 rounded px-2 py-1 flex-1 font-mono text-slate-200">
                                {state.type === 'list' || state.type === 'dict' || state.type === 'function' || state.type === 'class' || state.type.endsWith('instance') ? (
                                  <span className="text-indigo-400 flex items-center h-full text-xs italic">pointer ➔</span>
                                ) : state.type === 'str' ? (
                                  <span className="text-emerald-400">"{state.value}"</span>
                                ) : state.type === 'int' || state.type === 'float' ? (
                                  <span className="text-blue-400">{state.value}</span>
                                ) : state.type === 'bool' ? (
                                  <span className="text-purple-400">{String(state.value)}</span>
                                ) : (
                                  String(state.value)
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Objects */}
                <div className="flex-1 flex flex-col gap-4">
                  {allObjects.map(({ name, state }, idx) => (
                    <div key={idx} className="bg-amber-900/10 border border-amber-500/30 rounded p-3 shrink-0">
                      <div className="text-xs text-amber-500/70 mb-2 font-mono font-bold">{state.type === 'class' ? \`\${name} class\` : state.type}</div>
                      <div className="flex flex-wrap bg-black/40 border border-white/10 rounded overflow-hidden">
                        {state.type === 'list' && Array.isArray(state.value) ? (
                          state.value.map((v: any, i: number) => (
                            <div key={i} className="flex flex-col border-r border-white/10 last:border-r-0 min-w-[2.5rem]">
                              <div className="bg-white/5 text-[10px] text-slate-500 text-center border-b border-white/10 p-0.5">{i}</div>
                              <div className="text-center p-1.5 font-mono text-sm text-slate-200">{JSON.stringify(v)}</div>
                            </div>
                          ))
                        ) : state.type === 'class' || state.type.endsWith('instance') || (state.type === 'dict' && typeof state.value === 'object' && state.value !== null) ? (
                          <div className="flex flex-col w-full">
                            {Object.entries(state.value).map(([k, v], i) => (
                              <div key={i} className="flex border-b border-white/10 last:border-b-0 w-full text-sm font-mono">
                                <div className="w-1/2 p-1.5 border-r border-white/10 bg-white/5 text-slate-400">{k}</div>
                                <div className="w-1/2 p-1.5 text-slate-200">{String(v)}</div>
                              </div>
                            ))}
                          </div>
                        ) : state.type === 'function' ? (
                          <div className="p-2 font-mono text-sm text-slate-200">{String(state.value)}</div>
                        ) : (
                          <div className="p-2 font-mono text-sm text-slate-200">{JSON.stringify(state.value)}</div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {allObjects.length === 0 && (
                    <div className="text-slate-500 text-sm italic text-center mt-4">No objects in heap</div>
                  )}
                </div>`);

fs.writeFileSync('src/components/editor/CodeVisualizer.tsx', content);
