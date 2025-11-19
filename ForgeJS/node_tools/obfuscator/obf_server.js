const readline = require('readline');
const Obf = require('javascript-obfuscator');
const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
function respond(obj){ try{ process.stdout.write(JSON.stringify(obj)+'\n'); }catch(e){} }
rl.on('line', (line) => {
  try {
    const msg = JSON.parse(line);
    const code = Buffer.from(msg.b64 || '', 'base64').toString('utf8');
    // 中等混淆配置（单一配置，避免多次尝试）
    const options = {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.5,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.2,
      identifierNamesGenerator: 'hexadecimal',
      renameGlobals: false
    };
    let out='';
    try { out = Obf.obfuscate(code, options).getObfuscatedCode(); } catch(e) { respond({ok:false, error: String(e)}); return; }
    respond({ok:true, b64: Buffer.from(out,'utf8').toString('base64')});
  } catch (e) { respond({ok:false, error: String(e)}); }
});
