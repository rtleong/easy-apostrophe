// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.easyapostrophe', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const position = selection.active;

            // Get the current line
            const lineText = document.lineAt(position.line).text;
            const lineLength = lineText.length;

            // Check if the cursor is at the end of the string
            if (position.character === lineLength) {
                // Find the first non-whitespace character
                const firstNonWhitespaceIndex = lineText.search(/\S/);

                if (firstNonWhitespaceIndex !== -1) {
                    editor.edit(editBuilder => {
                        // Insert apostrophe at the start and end of the string
                        editBuilder.insert(new vscode.Position(position.line, firstNonWhitespaceIndex), "'");
                        editBuilder.insert(position, "'");
                    });
                }
            }
        }
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
