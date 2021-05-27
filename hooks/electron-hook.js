/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const path = require('path');

const cdvElectronMainFile = path.resolve(__dirname, '../platforms/electron/platform_www/cdv-electron-main.js');
const electronDir = path.resolve(__dirname, '../src/electron/main/');
const electronFiles = fs.readdirSync(electronDir);
let newStr = '';

if (!fs.existsSync(cdvElectronMainFile)) {
  console.error("Platform 'electron' does not exists.");
  process.exit(0);
}

for (const file of electronFiles) {
  const fileContent = fs.readFileSync(path.join(electronDir, file), 'utf8');
  newStr += `\n/*usercode:start*/(function (){ ${fileContent}})();/*usercode:end*/\n`;
}

const fileContent = fs.readFileSync(cdvElectronMainFile, 'utf8');
let newFileContent = '';

if (/\/\*usercode:start\*\//.test(fileContent)) {
  newFileContent = fileContent.replace(
    /\/\*usercode:start\*\/.*\/*usercode:end\*\//,
    newStr.trim(),
  );
} else {
  newFileContent = fileContent.replace(/(new BrowserWindow\(browserWindowOpts\);)/, `$1${newStr}`);
}

fs.writeFileSync(cdvElectronMainFile, newFileContent);
process.exit(0);
