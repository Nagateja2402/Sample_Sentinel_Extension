"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_directory_using_vscodeapi = void 0;
var vscode = require("vscode");
function create_directory_using_vscodeapi() {
    vscode.window
        .showInputBox({
        prompt: "Enter the name of the directory",
        placeHolder: "Directory Name",
    })
        .then(function (dirname) {
        var workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            var pwdPath = workspaceFolders[0].uri;
            var dirPath = vscode.Uri.joinPath(pwdPath, dirname);
            vscode.workspace.fs.createDirectory(dirPath);
            var fileUri = vscode.Uri.joinPath(dirPath, 'new.sentinel');
            var fileContent = new TextEncoder().encode('');
            vscode.workspace.fs.writeFile(fileUri, fileContent);
            vscode.window.showInformationMessage('Folder Structure Created using VSCode Api');
        }
    });
}
exports.create_directory_using_vscodeapi = create_directory_using_vscodeapi;
