import * as vscode from 'vscode';
import { EditorTitleManager } from './editorTitleManager';
import { initSwitcher } from './windowSwitcher';
import { initDiscovery } from './windowDiscovery';

export function activate(context: vscode.ExtensionContext) {
  initSwitcher(context.extensionPath);
  initDiscovery(context.extensionPath);
  const editorTitle = new EditorTitleManager(context);

  const refreshAll = () => {
    editorTitle.refresh();
  };

  context.subscriptions.push(
    vscode.commands.registerCommand('switchItEasy.refresh', refreshAll)
  );

  // Auto-refresh every 5 seconds
  const interval = setInterval(refreshAll, 5000);
  context.subscriptions.push({ dispose: () => clearInterval(interval) });

  context.subscriptions.push(
    vscode.window.onDidChangeWindowState((e) => {
      if (e.focused) {
        refreshAll();
      }
    })
  );

  context.subscriptions.push(editorTitle);
  editorTitle.refresh();
}

export function deactivate() {}
