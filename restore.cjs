const fs = require('fs');

const logContent = fs.readFileSync('C:\\Users\\DC\\.gemini\\antigravity\\brain\\9c202b05-4178-47db-873b-8219d62ff2ef\\.system_generated\\logs\\overview.txt', 'utf8');
const lines = logContent.split('\n');

let styleDone = false;
let mainDone = false;

for (const line of lines) {
    if (!line.trim()) continue;
    try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
            for (const call of obj.tool_calls) {
                if (call.name === 'write_to_file' && call.args && call.args.TargetFile) {
                    let targetFile = call.args.TargetFile;
                    try { targetFile = JSON.parse(targetFile); } catch(e){}
                    
                    if (targetFile === 'c:\\wad\\portfolio_web\\style.css' && !styleDone) {
                        let content = call.args.CodeContent;
                        try { content = JSON.parse(content); } catch(e){}
                        fs.writeFileSync('c:\\wad\\portfolio_web\\style.css', content);
                        console.log('Restored style.css');
                        styleDone = true;
                    }
                    if (targetFile === 'c:\\wad\\portfolio_web\\main.js' && !mainDone) {
                        let content = call.args.CodeContent;
                        try { content = JSON.parse(content); } catch(e){}
                        fs.writeFileSync('c:\\wad\\portfolio_web\\main.js', content);
                        console.log('Restored main.js');
                        mainDone = true;
                    }
                }
            }
        }
    } catch(e) {
        // ignore
    }
}
