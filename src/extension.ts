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

             // Find the first occurrence of '=' or '<-'
            // const equalsIndex = lineText.indexOf('=');
            // const assignmentIndex = lineText.indexOf('<-');
            const operators = ['===', '==', '=', '<-'];
             let startIndex = -1;
             //let endPosition = lineLength;
 
            // Check for operators and determine startIndex
            for (const op of operators) {
                const index = lineText.indexOf(op);
                if (index !== -1) {
                    startIndex = index + op.length;
                    break;
                }
            }

            // If no operator is found, use the start of the line
            if (startIndex === -1) {
                startIndex = 0;
            }

            // Extract and trim the substring after the determined startIndex
            const substring = lineText.substring(startIndex).trim();
            const firstNonWhitespaceIndex = lineText.indexOf(substring, startIndex);

            // Define positions for inserting apostrophes
            const actualStart = firstNonWhitespaceIndex;
            const actualEnd = lineLength;

            // Insert apostrophes if at the end of the line or start of the string
            if (position.character === lineLength || position.character === actualStart) {
                editor.edit(editBuilder => {
                    // Insert apostrophe at the start and end of the content
                    editBuilder.insert(new vscode.Position(position.line, actualStart), "'");
                    editBuilder.insert(new vscode.Position(position.line, actualEnd), "'");
                });
            }
        }
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
