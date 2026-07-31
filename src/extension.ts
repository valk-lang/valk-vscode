// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { startLsp, stopLsp, restartLsp, updateDiagnosticsMode } from './lsp';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let output = vscode.window.createOutputChannel("Valk Language Server", { log: true });

	context.subscriptions.push(
		output,
		vscode.commands.registerCommand("valk.lsp.start", async () => {
            await startLsp(context, output);
        }),
		vscode.commands.registerCommand("valk.lsp.stop", async () => {
            await stopLsp(context, output);
        }),
		vscode.commands.registerCommand("valk.lsp.restart", async () => {
            await restartLsp(context, output);
        }),
		vscode.workspace.onDidChangeConfiguration(async event => {
			if (!event.affectsConfiguration('valk.lsp.diagnosticsMode')) return;
			try {
				await updateDiagnosticsMode();
			} catch (err) {
				output.appendLine('Failed to update Valk diagnostics mode: ' + err);
			}
		}),
	)

	const config = vscode.workspace.getConfiguration('valk');
	const enable = config.get<null|boolean>('lsp.enable')
	if (enable !== false) {
		startLsp(context, output)
	}
}

// This method is called when your extension is deactivated
export function deactivate() { }
