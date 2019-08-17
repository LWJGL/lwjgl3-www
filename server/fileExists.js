const fs = require('fs');

function fileExists(path) {
  try {
    return fs.statSync(path).isFile();
  } catch {
    return false;
  }
}

module.exports = fileExists;
