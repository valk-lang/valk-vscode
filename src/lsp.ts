
import * as vscode from 'vscode';
import { spawn } from 'node:child_process';
import * as stream from 'node:stream';
import fs from 'fs';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
	RevealOutputChannelOn,
	Trace,
	StreamInfo,
} from 'vscode-languageclient/node';

let client: LanguageClient | null;

export async function startLsp(context: vscode.ExtensionContext, output: vscode.OutputChannel) {

	console.log('Starting valk language server');

	const config = vscode.workspace.getConfiguration('valk');
	var cmd = "valk";

	// Check settings
	const valk_path = config.get<null|string>('path');
	if (valk_path) {
        if (!fs.existsSync(valk_path)) {
            vscode.window.showWarningMessage("Valk executable not found: " + valk_path);
            return
        }
		cmd = valk_path
	}
	var serverOptions: ServerOptions = {
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

	const is_debug = config.get<boolean>('lsp_debug');
	if (is_debug) {

		serverOptions = () => {
			// Spawn your language server
			const child = spawn(cmd, ["lsp", "run"], {
				stdio: ['pipe', 'pipe', 'pipe']
			});

			// Wrap stdout so we can log everything coming from the server
			const loggingReadable = new stream.PassThrough();
			child.stdout.pipe(loggingReadable);

			loggingReadable.on('data', chunk => {
				output.appendLine("<<< " + chunk.toString());
			});

			// Wrap stdin so we can log everything going to the server
			const loggingWritable = new stream.PassThrough();
			loggingWritable.pipe(child.stdin);

			loggingWritable.on('data', chunk => {
				output.appendLine(">>> " + chunk.toString());
			});

			// Return a StreamInfo object for the client
			const result: StreamInfo = {
				reader: loggingReadable,
				writer: loggingWritable
			};

			return Promise.resolve(result);
		};
	}

	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: "file", language: "valk" }],
		outputChannel: output,
		traceOutputChannel: output,
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

export async function stopLsp(context: vscode.ExtensionContext, output: vscode.OutputChannel) {
    if (!client) return;
    let prev = client
    client = null
    await prev.stop();
    await prev.dispose();
}

export async function restartLsp(context: vscode.ExtensionContext, output: vscode.OutputChannel) {
    await stopLsp(context, output)
    await startLsp(context, output)
}
