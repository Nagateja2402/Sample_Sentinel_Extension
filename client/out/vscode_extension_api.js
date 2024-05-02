"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_directory_using_vscodeapi = void 0;
const vscode = require("vscode");
function create_directory_using_vscodeapi() {
    vscode.window
        .showInputBox({
        prompt: "Enter the name of the directory",
        placeHolder: "Directory Name",
    })
        .then((dirname) => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            const pwdPath = workspaceFolders[0].uri;
            const dirPath = vscode.Uri.joinPath(pwdPath, dirname);
            vscode.workspace.fs.createDirectory(dirPath);
            const fileUri = vscode.Uri.joinPath(dirPath, 'new.sentinel');
            const fileContent = new TextEncoder().encode('');
            vscode.workspace.fs.writeFile(fileUri, fileContent);
            vscode.window.showInformationMessage('Folder Structure Created using VSCode Api');
        }
    });
}
exports.create_directory_using_vscodeapi = create_directory_using_vscodeapi;
//# sourceMappingURL=vscode_extension_api.js.map