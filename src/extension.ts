import * as vscode from 'vscode';
import * as fs from 'fs';
import * as childProcess from 'child_process';
import { html, Diff2HtmlConfig } from 'diff2html';
const downloadFolder = require('os').homedir().split('\\').join('/') + '/Downloads';


export function activate(context: vscode.ExtensionContext) {
	let createFilesDisposable = vscode.commands.registerCommand('diff-saver.compareText', () => {
		
		// Open the files in the editor
		vscode.workspace.openTextDocument().then((doc) => {
			vscode.window.showTextDocument(doc, 1);
		});
		vscode.workspace.openTextDocument().then((doc) => {
			vscode.window.showTextDocument(doc, 2);
		});
	});

	let runGitDiffHtmlDisposable = vscode.commands.registerCommand('diff-saver.saveDiffHtml', () => {
		const timestamp = new Date().toLocaleString().replace(/[/, :]/g, '-');
		const filesToDelete: string[] = [];

		// Run git diff on the two files
		for (let i = 0; i < vscode.workspace.textDocuments.length ; i++) {
			const doc = vscode.workspace.textDocuments[i];
			if (doc.uri.scheme === 'untitled') {
				const filepath = doc.uri.fsPath;
				filesToDelete.push(filepath);
				fs.writeFileSync(filepath, doc.getText());
			}
		}
		childProcess.exec(`git diff ${filesToDelete[0]} ${filesToDelete[1]}`, (error, stdout) => {
			const diffHtml = html(stdout, {outputFormat: 'side-by-side', drawFileList: false, } as Diff2HtmlConfig);
			fs.writeFileSync(`${downloadFolder}/${timestamp}temp.html`, `<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css" />${diffHtml}`);
			// >> ${downloadFolder}/${timestamp}temp.diff
			// Delete the two text files
			filesToDelete.forEach((filepath) => {
				fs.unlinkSync(filepath);
			});

			vscode.window.showInformationMessage(`Git diff saved as ${timestamp}temp.html file in Downloads Folder`);
			// Open the diff.txt file in the editor
			vscode.workspace.openTextDocument(`${downloadFolder}/${timestamp}temp.html`).then((doc) => {
				vscode.window.showTextDocument(doc);
			});
		});
	});

	let runGitDiffPatchDisposable = vscode.commands.registerCommand('diff-saver.saveDiffPatch', () => {
		const timestamp = new Date().toLocaleString().replace(/[/, :]/g, '-');
		const filesToDelete: string[] = [];

		// Run git diff on the two files
		for (let i = 0; i < vscode.workspace.textDocuments.length ; i++) {
			const doc = vscode.workspace.textDocuments[i];
			if (doc.uri.scheme === 'untitled') {
				const filepath = doc.uri.fsPath;
				filesToDelete.push(filepath);
				fs.writeFileSync(filepath, doc.getText());
			}
		}
		childProcess.exec(`git diff ${filesToDelete[0]} ${filesToDelete[1]} >> ${downloadFolder}/${timestamp}temp.patch`, (error, stdout) => {
			// >> ${downloadFolder}/${timestamp}temp.diff
			// Delete the two text files
			filesToDelete.forEach((filepath) => {
				fs.unlinkSync(filepath);
			});

			vscode.window.showInformationMessage(`Git diff saved as ${timestamp}temp.patch file in Downloads Folder`);
			// Open the diff.txt file in the editor
			vscode.workspace.openTextDocument(`${downloadFolder}/${timestamp}temp.patch`).then((doc) => {
				vscode.window.showTextDocument(doc);
			});
		});
	});

	context.subscriptions.push(createFilesDisposable);
	context.subscriptions.push(runGitDiffHtmlDisposable);
	context.subscriptions.push(runGitDiffPatchDisposable);
}
