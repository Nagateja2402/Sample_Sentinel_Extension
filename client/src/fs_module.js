"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_directory_using_fsmodule = void 0;
var vscode = require("vscode");
var fs = require("fs");
var path = require("path");
function create_directory_using_fsmodule() {
    vscode.window
        .showInputBox({
        prompt: "Enter the name of the directory",
        placeHolder: "Directory Name",
    })
        .then(function (dirname) {
        var workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            var pwdPath = workspaceFolders[0].uri.fsPath;
            var dirPath = path.join(pwdPath, dirname);
            vscode.window.showInformationMessage(dirPath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            else {
                console.log("Directory Already Exists");
                vscode.window.showErrorMessage(" Directory Already Exists");
            }
            var filePath = path.join(dirPath, "/new.sentinel");
            if (!fs.existsSync(filePath)) {
                fs.open(filePath, "w", function () { });
                vscode.window.showInformationMessage("Folder Structure created using FS Module");
                console.log("Folder Structure created using FS Module");
            }
        }
        else {
            vscode.window.showErrorMessage("No working Directory");
        }
    });
}
exports.create_directory_using_fsmodule = create_directory_using_fsmodule;
