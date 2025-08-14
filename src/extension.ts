// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Starting valk language server');

	let outputChannel = vscode.window.createOutputChannel("Valk Language Server");

	const cmd = "valk";

	var commandExists = require('command-exists');
	commandExists(cmd).then(function () {

		const serverOptions: ServerOptions = {
			run: {
				command: cmd,
				transport: TransportKind.stdio,
				args: ['ls', 'start']
			},
			debug: {
				command: cmd,
				transport: TransportKind.stdio,
				args: ['ls', 'start']
			}
		};

		const clientOptions: LanguageClientOptions = {
			documentSelector: [{ scheme: 'file', language: 'valk' }],
			outputChannel: outputChannel,
			traceOutputChannel: outputChannel
		};

		client = new LanguageClient(
			'valkLanguageServer',
			'Valk Language Server',
			serverOptions,
			clientOptions
		);

		client.start();

	    console.log('Valk language server is running');

	}).catch(function () {
		vscode.window.showErrorMessage("Valk is not installed or not added to the PATH environment variable");
	});

	// // The command has been defined in the package.json file
	// // Now provide the implementation of the command with registerCommand
	// // The commandId parameter must match the command field in package.json
	// const disposable = vscode.commands.registerCommand('valk-vscode.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from valk-vscode!');
	// });

	// context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
