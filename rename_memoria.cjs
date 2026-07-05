const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, "src"), (filePath) => {
  if (filePath.endsWith(".tsx") || filePath.endsWith(".ts")) {
    let content = fs.readFileSync(filePath, "utf-8");
    if (content.includes("Aethos")) {
      content = content.replace(/Aethos/g, "Memoria");
      // Change logo component name
      content = content.replace(/AethosLogo/g, "MemoriaLogo");
      fs.writeFileSync(filePath, content, "utf-8");
    }
  }
});
console.log("Renamed Aethos to Memoria");
