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
             const equalsIndex = lineText.indexOf('=');
             const assignmentIndex = lineText.indexOf('<-');
            let startIndex = -1;
             //let endPosition = lineLength;
 
             if (equalsIndex !== -1 && (assignmentIndex === -1 || equalsIndex < assignmentIndex)) {
                startIndex = equalsIndex + 1;
            } else if (assignmentIndex !== -1) {
                startIndex = assignmentIndex + 2; // +2 because '<-' is 2 characters
            }

            if (startIndex !== -1) {
                // Extract the substring after the assignment
                const substring = lineText.substring(startIndex).trim();

                // Find the actual start of the string content after any spaces
                const firstNonWhitespaceIndex = startIndex + lineText.substring(startIndex).search(/\S/);

                // Calculate end position for the quote
                const endPosition = lineText.length;

                if (position.character === endPosition) {
                    editor.edit(editBuilder => {
                        // Insert apostrophe at the start and end of the substring
                        editBuilder.insert(new vscode.Position(position.line, firstNonWhitespaceIndex), "'");
                        editBuilder.insert(new vscode.Position(position.line, lineText.length), "'");
                    });
                }
            }
        }
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
