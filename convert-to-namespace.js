const fs = require('fs');
const path = require('path');

const dirPath = './src'; 

function convertToNamespace(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.ts');
  const namespace = fileName.charAt(0).toUpperCase() + fileName.slice(1);

  let newContent = content
    .replace(/export\s+/g, '') 
    .replace(/import\s+.*\s+from\s+['"].*['"];?/g, '');

  newContent = `namespace ${namespace} {\n${newContent}\n}`;

  fs.writeFileSync(filePath, newContent);
}

function processDirectory(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.ts')) {
      convertToNamespace(fullPath);
      console.log(`Converted: ${file}`);
    }
  });
}

processDirectory(dirPath);
console.log('All files converted to namespace!');
