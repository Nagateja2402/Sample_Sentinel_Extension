"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const path = require("path");
const fs = require("fs");
const searchrepo = require("./getGithubcontent");
const vscode_1 = require("vscode");
const vscode = require("vscode");
const node_1 = require("vscode-languageclient/node");
let client;
function activate(context) {
    // The server is implemented in node
    const serverModule = context.asAbsolutePath(path.join("server", "out", "server.js"));
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions = {
        run: { module: serverModule, transport: node_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: node_1.TransportKind.ipc,
        },
    };
    // Options to control the language client
    const clientOptions = {
        // Register the server for plain text documents
        documentSelector: [{ scheme: "file", language: "sentinel" }],
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            fileEvents: vscode_1.workspace.createFileSystemWatcher("**/.clientrc"),
        },
    };
    // Create the language client and start the client.
    client = new node_1.LanguageClient("languageServerExample", "Language Server Example", serverOptions, clientOptions);
    vscode.window.showInformationMessage("Client Launched");
    //Init Command
    const init = vscode.commands.registerCommand("sample-sentinel-extension.init", () => {
        vscode.window
            .showInputBox({
            prompt: "Enter the name of the directory",
            placeHolder: "Directory Name",
        })
            .then((dirname) => {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (workspaceFolders && workspaceFolders.length > 0) {
                const pwdPath = workspaceFolders[0].uri.fsPath;
                const dirPath = path.join(pwdPath, dirname);
                vscode.window.showInformationMessage(dirPath);
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                    vscode.window.showInformationMessage("Directory Created");
                    console.log("Directory Created");
                }
                else {
                    console.log("Directory Already Exists");
                    vscode.window.showErrorMessage(" Directory Already Exists");
                }
                const filePath = path.join(dirPath, "/new.sentinel");
                if (!fs.existsSync(filePath)) {
                    fs.open(filePath, "w", () => { });
                    vscode.window.showInformationMessage("File Created");
                    console.log("File Created");
                }
            }
            else {
                vscode.window.showErrorMessage("No working Directory");
            }
        });
    });
    let datafromapi = vscode.commands.registerTextEditorCommand("extension.printLastCommentLine", async (editor) => {
        vscode.commands.executeCommand("editor.action.insertLineAfter");
        const document = editor.document;
        const cursorPosition = editor.selection.active;
        const lines = document.getText().split("\n");
        const lastLineOfComment = getLastLineOfComment(lines, cursorPosition);
        const values = lastLineOfComment.split(':');
        const filepath = vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.uri);
        const pwdPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const totalpath = path.join(pwdPath, values[1]);
        console.log(totalpath);
        vscode.window.showInformationMessage(lastLineOfComment);
        const filecontent = searchrepo.getFilesInRepository(values[0]);
        vscode.workspace.fs.writeFile(vscode.Uri.file(totalpath), Buffer.from(await filecontent));
    });
    function getLastLineOfComment(lines, cursorPosition) {
        for (let i = cursorPosition.line; i >= 0; i--) {
            const line = lines[i].trim();
            if (!line.startsWith("//")) {
                break; // Exit loop if not a comment line
            }
            if (line.length > 2) {
                return line.substring(2).trim(); // Remove "//" prefix and trim whitespace
            }
        }
        return null; // No comment line found
    }
    context.subscriptions.push(datafromapi);
    context.subscriptions.push(init);
    // Start the client. This will also launch the server
    client.start();
}
exports.activate = activate;
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map