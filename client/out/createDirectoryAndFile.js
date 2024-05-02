"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const directoryPath = path.join('Documents/Projects', 'newDirectory');
// Create directory
fs.mkdirSync(directoryPath);
// Create file
const filePath = path.join(directoryPath, 'newFile.sentinel');
fs.writeFileSync(filePath, 'Hello, world!');
console.log('Directory and file created successfully.');
//# sourceMappingURL=createDirectoryAndFile.js.map