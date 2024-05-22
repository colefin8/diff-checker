import * as vscode from 'vscode';
import * as fs from 'fs';
import * as childProcess from 'child_process';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "diff-saver" is now active!');
	const workspaceFolders = vscode.workspace.workspaceFolders || [];
	const repoPath = workspaceFolders[0]?.uri.fsPath;
	console.log(repoPath);
	let createFilesDisposable = vscode.commands.registerCommand('diff-saver.compareText', () => {
		// Create two text files
		fs.writeFileSync(`${repoPath}/tempFile1.txt`, 'This is file 1 content');
		fs.writeFileSync(`${repoPath}/tempFile2.txt`, 'This is file 2 content');

		// Open the files in the editor
		vscode.workspace.openTextDocument(fs.realpathSync(`${repoPath}/tempFile1.txt`)).then((doc) => {
			vscode.window.showTextDocument(doc, 1);
		});
		vscode.workspace.openTextDocument(fs.realpathSync(`${repoPath}/tempFile2.txt`)).then((doc) => {
			vscode.window.showTextDocument(doc, 2);
		});
	});

	let runGitDiffDisposable = vscode.commands.registerCommand('diff-saver.saveDiff', () => {
		// Run git diff on the two files
		childProcess.exec(`git diff --no-index ${repoPath}/tempFile1.txt ${repoPath}/tempFile2.txt`, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage('Error running git diff: ' + error.message);
				return;
			}

			// Save the diff as a .txt file
			fs.writeFileSync(`~/Downloads/diff.txt`, stdout);

			// Delete the two text files
			fs.unlinkSync(fs.realpathSync(`${repoPath}/tempFile1.txt`));
			fs.unlinkSync(fs.realpathSync(`${repoPath}/tempFile2.txt`));

			vscode.window.showInformationMessage('Git diff saved as diff.txt');
			// Open the diff.txt file in the editor
			vscode.workspace.openTextDocument(`~/Downloads/diff.txt`).then((doc) => {
				vscode.window.showTextDocument(doc);
			});
		});
	});

	context.subscriptions.push(createFilesDisposable);
	context.subscriptions.push(runGitDiffDisposable);
}
