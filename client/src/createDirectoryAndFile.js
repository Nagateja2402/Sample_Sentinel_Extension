"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var directoryPath = path.join('Documents/Projects', 'newDirectory');
// Create directory
fs.mkdirSync(directoryPath);
// Create file
var filePath = path.join(directoryPath, 'newFile.sentinel');
fs.writeFileSync(filePath, 'Hello, world!');
console.log('Directory and file created successfully.');
