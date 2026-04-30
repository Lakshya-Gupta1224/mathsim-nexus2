const fs = require('fs');
const path = require('path');
const dir = 'src/components/simulators';
const files = fs.readdirSync(dir);

let count = 0;
files.forEach(file => {
  if (!file.endsWith('Canvas.js') && file !== 'MarbleOverlay.js' && file !== 'VectorFieldBoat.js') return;
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, 'utf8');
  
  let changed = false;
  if (content.includes('h-80')) {
    content = content.replace(/h-80/g, 'min-h-[500px] 2xl:min-h-[700px] h-[70vh]');
    changed = true;
  }
  
  if (file === 'MarbleOverlay.js') {
    if (content.includes('style={{ height: 320,')) {
        content = content.replace('style={{ height: 320,', 'style={{ minHeight: 500, height: "70vh",');
        changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(fp, content);
    count++;
  }
});
console.log('Updated ' + count + ' files');
