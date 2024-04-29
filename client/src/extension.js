"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
var path = require("path");
var fs = require("fs");
var searchrepo = require("./getGithubcontent");
var vscode_1 = require("vscode");
var vscode = require("vscode");
var node_1 = require("vscode-languageclient/node");
var client;
function activate(context) {
    var _this = this;
    var serverModule = context.asAbsolutePath(path.join("server", "out", "server.js"));
    var serverOptions = {
        run: { module: serverModule, transport: node_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: node_1.TransportKind.ipc,
        },
    };
    var clientOptions = {
        documentSelector: [{ scheme: "folder", language: "sentinel" }],
        synchronize: {
            fileEvents: vscode_1.workspace.createFileSystemWatcher("**/.clientrc"),
        },
    };
    client = new node_1.LanguageClient("languageServerExample", "Language Server Example", serverOptions, clientOptions);
    vscode.window.showInformationMessage("Client Launched");
    //Init Command
    var init = vscode.commands.registerCommand("sample-sentinel-extension.init", function () {
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
                    vscode.window.showInformationMessage("Directory Created");
                    console.log("Directory Created");
                }
                else {
                    console.log("Directory Already Exists");
                    vscode.window.showErrorMessage(" Directory Already Exists");
                }
                var filePath = path.join(dirPath, "/new.sentinel");
                if (!fs.existsSync(filePath)) {
                    fs.open(filePath, "w", function () { });
                    vscode.window.showInformationMessage("File Created");
                    console.log("File Created");
                }
            }
            else {
                vscode.window.showErrorMessage("No working Directory");
            }
        });
    });
    var datafromapi = vscode.commands.registerTextEditorCommand("extension.printLastCommentLine", function (editor) { return __awaiter(_this, void 0, void 0, function () {
        var document, cursorPosition, lines, lastLineOfComment, values, filepath, pwdPath, totalpath, filecontent, _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    vscode.commands.executeCommand("editor.action.insertLineAfter");
                    document = editor.document;
                    cursorPosition = editor.selection.active;
                    lines = document.getText().split("\n");
                    lastLineOfComment = getLastLineOfComment(lines, cursorPosition);
                    values = lastLineOfComment.split(':');
                    filepath = vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.uri);
                    pwdPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
                    totalpath = path.join(pwdPath, values[1]);
                    console.log(totalpath);
                    vscode.window.showInformationMessage(lastLineOfComment);
                    filecontent = searchrepo.getFilesInRepository(values[0]);
                    _b = (_a = vscode.workspace.fs).writeFile;
                    _c = [vscode.Uri.file(totalpath)];
                    _e = (_d = Buffer).from;
                    return [4 /*yield*/, filecontent];
                case 1:
                    _b.apply(_a, _c.concat([_e.apply(_d, [_f.sent()])]));
                    return [2 /*return*/];
            }
        });
    }); });
    function getLastLineOfComment(lines, cursorPosition) {
        for (var i = cursorPosition.line; i >= 0; i--) {
            var line = lines[i].trim();
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
