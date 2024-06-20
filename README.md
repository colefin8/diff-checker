# diff-saver README

This extension was an exercise in creating a way to share git diffs of specific parts of files.  Often GitHub will show more parts of the files changed than actually did, or get messy with whitespace or rearranging changes.  This allows users to paste in the code before and after the changes, and will spit out a file that can be shared or viewed by anyone.  The biggest hurdle to this extension was that GitHub doesn't allow you to upload .html files.  You can save your diff as a .patch file, which can be uploaded to GitHub, and then opened in VSCode and viewed (usually with an extension).

## Installation

I'm not putting this on the 

## Features

There are 3 commands in this extension.

1. Open Untitiled Files to Paste Text - this will open two files in your editor for you to paste the two different texts you want to diff
2. Create Shareable .html File in Downloads - this will diff the two files, parse the diff to html, and then store the html file in your downloads folder
3. Create Shareable .patch File in Downloads - this will diff the two files and then store the patch file in your downloads folder - not as pretty, but can be uploaded to GitHub

## Requirements

I suggest downloading an extension to view .patch files.  The one I prefer is [Diff Viewer](https://marketplace.visualstudio.com/items?itemName=caponetto.vscode-diff-viewer).  It actually uses the same library as this extension does under the hood
