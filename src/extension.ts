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

            // Handle content inside parentheses
            const openParenIndex = lineText.lastIndexOf('(', position.character);
            const closeParenIndex = lineText.indexOf(')', position.character);

            if (openParenIndex !== -1 && closeParenIndex !== -1 && openParenIndex < closeParenIndex) {
                // Extract the content inside the parentheses
                let contentInsideParens = lineText.substring(openParenIndex + 1, closeParenIndex);

                // Find operators within parentheses
                const operators = ['===', '==', '=', '<-'];
                let startIndex = -1;

                for (const op of operators) {
                    const index = contentInsideParens.indexOf(op);
                    if (index !== -1) {
                        startIndex = index + op.length;
                        break;
                    }
                }

                // If no operator is found, use the start of the content inside parentheses
                if (startIndex === -1) {
                    startIndex = 0;
                }

                // Handle comma-separated values within parentheses
                const substring = contentInsideParens.substring(startIndex).trim();
                const parts = substring.split(/,\s*/);
                if (parts.length > 1) {
                    const quotedParts = parts.map(part => `'${part}'`);
                    const result = quotedParts.join(', ');

                    // Replace only the content to the right of the operator
                    const actualStart = openParenIndex + 1 + startIndex;
                    const actualEnd = closeParenIndex;

                    editor.edit(editBuilder => {
                        editBuilder.replace(new vscode.Range(new vscode.Position(position.line, actualStart), new vscode.Position(position.line, actualEnd)), result);
                    });
                } else {
                    const result = `'${substring}'`;

                    // Replace only the content to the right of the operator
                    const actualStart = openParenIndex + 1 + startIndex;
                    const actualEnd = closeParenIndex;

                    editor.edit(editBuilder => {
                        editBuilder.replace(new vscode.Range(new vscode.Position(position.line, actualStart), new vscode.Position(position.line, actualEnd)), result);
                    });
                }
                return; // Exit after handling parentheses content
            }

            // Handle content after operators outside parentheses
            const operators = ['===', '==', '=', '<-'];
            let startIndexOperator = -1;
            let operatorLength = 0;

            for (const op of operators) {
                const index = lineText.indexOf(op);
                if (index !== -1 && index + op.length <= position.character) {
                    startIndexOperator = index + op.length;
                    operatorLength = op.length;
                    break;
                }
            }

            if (startIndexOperator === -1) {
                startIndexOperator = 0;
            }

            // Extract the content after the operator or from the start if no operator is found
            const substring = lineText.substring(startIndexOperator).trim();
            const parts = substring.split(/,\s*/);
            if (parts.length > 1) {
                const quotedParts = parts.map(part => `'${part}'`);
                const result = quotedParts.join(', ');

                const actualStart = startIndexOperator;
                const actualEnd = lineLength;

                editor.edit(editBuilder => {
                    editBuilder.replace(new vscode.Range(new vscode.Position(position.line, actualStart), new vscode.Position(position.line, actualEnd)), result);
                });
            } else {
                const firstNonWhitespaceIndex = lineText.indexOf(substring, startIndexOperator);
                const actualStart = firstNonWhitespaceIndex;
                const actualEnd = lineLength;

                if (position.character === lineLength || position.character === actualStart) {
                    editor.edit(editBuilder => {
                        editBuilder.insert(new vscode.Position(position.line, actualStart), "'");
                        editBuilder.insert(new vscode.Position(position.line, actualEnd), "'");
                    });
                }
            }
        }
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
