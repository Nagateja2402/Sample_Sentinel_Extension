"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const path = require("path");
const searchrepo = require("./getGithubcontent");
const vscode_extension_api_1 = require("./vscode_extension_api");
const vscode_1 = require("vscode");
const vscode = require("vscode");
const node_1 = require("vscode-languageclient/node");
let client;
function activate(context) {
    const serverModule = context.asAbsolutePath(path.join("server", "out", "server.js"));
    const serverOptions = {
        run: { module: serverModule, transport: node_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: node_1.TransportKind.ipc,
        },
    };
    const clientOptions = {
        documentSelector: [{ scheme: "folder", language: "sentinel" }],
        synchronize: {
            fileEvents: vscode_1.workspace.createFileSystemWatcher("**/.clientrc"),
        },
    };
    client = new node_1.LanguageClient("languageServerExample", "Language Server Example", serverOptions, clientOptions);
    vscode.window.showInformationMessage("Client Launched");
    //Init Command
    const init = vscode.commands.registerCommand("sample-sentinel-extension.init", () => {
        (0, vscode_extension_api_1.create_directory_using_vscodeapi)();
    });
    let datafromapi = vscode.commands.registerTextEditorCommand("extension.printLastCommentLine", async (editor) => {
        vscode.commands.executeCommand("editor.action.insertLineAfter");
        const document = editor.document;
        const cursorPosition = editor.selection.active;
        const lines = document.getText().split("\n");
        const lastLineOfComment = getLastLineOfComment(lines, cursorPosition);
        const values = lastLineOfComment.split(":");
        const filepath = vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.uri);
        const pwdPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const totalpath = path.join(pwdPath, values[4]);
        console.log(totalpath);
        vscode.window.showInformationMessage(lastLineOfComment);
        console.log(values);
        const filecontent = searchrepo.getFilesInRepository(values[0], values[1], values[2], values[3]);
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