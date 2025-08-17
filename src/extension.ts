// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { spawn } from 'node:child_process';
import * as stream from 'node:stream';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
	RevealOutputChannelOn,
	Trace,
	StreamInfo,
} from 'vscode-languageclient/node';

let client: LanguageClient;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// vscode.window.showInformationMessage('✅ Valk extension Activated!');
	console.log('Starting valk language server');

	let outputChannel = vscode.window.createOutputChannel("Valk Language Server", { log: true });

	// const cmd = "valk";
	const cmd = "/home/ctx/www/valk2/valk";

	const serverOptions: ServerOptions = {
		run: {
			command: cmd,
			transport: TransportKind.stdio,
			args: ['lsp', 'run'],
		},
		debug: {
			command: cmd,
			transport: TransportKind.stdio,
			args: ['lsp', 'run'],
		}
	};

	// const serverOptions: ServerOptions = () => {
	// 	// Spawn your language server
	// 	const child = spawn("/home/ctx/www/valk2/valk", ["lsp", "run"], {
	// 		stdio: ['pipe', 'pipe', 'pipe']
	// 	});

	// 	// Wrap stdout so we can log everything coming from the server
	// 	const loggingReadable = new stream.PassThrough();
	// 	child.stdout.pipe(loggingReadable);

	// 	loggingReadable.on('data', chunk => {
	// 		outputChannel.appendLine("<<< " + chunk.toString());
	// 	});

	// 	// Wrap stdin so we can log everything going to the server
	// 	const loggingWritable = new stream.PassThrough();
	// 	loggingWritable.pipe(child.stdin);

	// 	loggingWritable.on('data', chunk => {
	// 		outputChannel.appendLine(">>> " + chunk.toString());
	// 	});

	// 	// Return a StreamInfo object for the client
	// 	const result: StreamInfo = {
	// 		reader: loggingReadable,
	// 		writer: loggingWritable
	// 	};

	// 	return Promise.resolve(result);
	// };

	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: "file", language: "valk" }],
		outputChannel: outputChannel,
		traceOutputChannel: outputChannel,
		revealOutputChannelOn: RevealOutputChannelOn.Info,
	};

	try {
		client = new LanguageClient(
			'valkLanguageServer',
			'Valk Language Server',
			serverOptions,
			clientOptions
		);
		client.setTrace(Trace.Verbose);

		client.start();
		console.log('Valk language server is running');
	} catch (err) {
		console.error('Failed start the Valk language server: ', err);
	}

}

// This method is called when your extension is deactivated
export function deactivate() { }
