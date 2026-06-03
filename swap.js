const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const startTag = '{/* Code Visualizer Showcase Section */}';
const endTag = '{/* Feature Highlights Section */}';

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
  const newSection = `{/* Code Visualizer Showcase Section */}
      <motion.section
        {...fadeInUp}
        className="py-24 lg:py-32 border-b border-white/[0.04] bg-black relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-8 max-w-7xl relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Features */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '-80px' }}
            className="grid sm:grid-cols-2 gap-x-8 gap-y-16 order-2 lg:order-1"
          >
            {[
              { title: 'Step-by-Step Tracing', desc: 'Navigate through your execution line-by-line effortlessly.', icon: Scan },
              { title: 'Live Variables', desc: 'Watch values update in real-time as code runs.', icon: Eye },
              { title: 'Call Stack Visuals', desc: 'Understand function calls and scope intuitively.', icon: Layers },
              { title: 'Interactive Playback', desc: 'Play, pause, or auto-step at your own pace.', icon: PlayCircle },
            ].map((feat, i) => {
              const IconComponent = feat.icon;
              return (
                <motion.div key={feat.title} variants={staggerItem} className="flex flex-col items-start gap-4 group relative">
                  <div className="h-12 w-12 flex items-center justify-start text-slate-500 group-hover:text-emerald-400 transition-all group-hover:scale-110 group-hover:-translate-y-1">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="space-y-2 relative z-10">
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{feat.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right Column - Text */}
          <div className="space-y-8 order-1 lg:order-2 lg:pl-12">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.2em] text-emerald-400 uppercase">
              [04] The Visualizer
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1.05]">
              See your code <br/>
              <span className="font-script text-emerald-400 font-normal italic pr-2">come alive.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
              Our built-in Code Visualizer lets you step through every line of your Python code, watch variables change in real time, and understand memory — all inside the browser.
            </p>
          </div>
        </div>
      </motion.section>

      `;

  content = content.slice(0, startIndex) + newSection + content.slice(endIndex);
  fs.writeFileSync('src/app/page.tsx', content);
  console.log('Successfully replaced visualizer section.');
} else {
  console.log('Could not find tags.', startIndex, endIndex);
}
