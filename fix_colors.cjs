const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src/routes/memo.tsx");
let content = fs.readFileSync(filePath, "utf-8");

// Replacements to move from hardcoded dark mode to current theme variables
content = content.replace(/bg-\[#020204\] text-white/g, "bg-background text-foreground");
content = content.replace(/bg-\[#020204\]/g, "bg-background");
content = content.replace(/bg-\[#050508\]/g, "bg-[#FAF7F2]"); // Soft cream for sidebar
content = content.replace(/bg-\[#09090e\]/g, "bg-white");
content = content.replace(/border-\[#161622\]/g, "border-border");
content = content.replace(/border-white\/5/g, "border-border");
content = content.replace(/border-white\/10/g, "border-border");
content = content.replace(/bg-white\/\[0\.02\]/g, "bg-white");
content = content.replace(/bg-white\/\[0\.07\]/g, "bg-muted");
content = content.replace(/bg-white\/\[0\.01\]/g, "bg-white");
content = content.replace(/hover:bg-white\/5/g, "hover:bg-muted");
content = content.replace(/bg-white\/5/g, "bg-white border border-border");
content = content.replace(/text-white\/70/g, "text-muted-foreground");
content = content.replace(/text-white\/80/g, "text-muted-foreground");
content = content.replace(/text-white\/90/g, "text-foreground");
content = content.replace(/text-white/g, "text-foreground");
content = content.replace(/bg-black\/20/g, "bg-muted/50");
content = content.replace(/bg-white\/10/g, "bg-muted");
content = content.replace(/bg-black/g, "bg-foreground text-background");
content = content.replace(/border-white\/20/g, "border-border");
content = content.replace(/border-white\/30/g, "border-border");
content = content.replace(/text-white\/30/g, "text-muted-foreground/30");
content = content.replace(/hover:text-white/g, "hover:text-foreground");
content = content.replace(/bg-\[#050508\]\/40/g, "bg-[#FAF7F2]");
content = content.replace(/border-dashed border-white\/5/g, "border-dashed border-border");
content = content.replace(/text-red-400/g, "text-red-600");
content = content.replace(/text-red-300/g, "text-red-700");
content = content.replace(/border-red-900\/20/g, "border-red-200");
content = content.replace(/border-red-900\/40/g, "border-red-300");
content = content.replace(/bg-red-950\/10/g, "bg-red-50");
content = content.replace(/bg-red-950\/20/g, "bg-red-100");
content = content.replace(/bg-red-500\/10 text-red-400/g, "bg-red-50 text-red-600");


fs.writeFileSync(filePath, content, "utf-8");
console.log("Colors updated!");
