import * as vscode from 'vscode';
import { discoverWindows } from './windowDiscovery';
import { switchToWindow } from './windowSwitcher';
import { WindowInfo } from './types';

const MAX_SLOTS = 10;

export class EditorTitleManager {
  private disposables: vscode.Disposable[] = [];
  private windowData: WindowInfo[] = [];

  constructor(_context: vscode.ExtensionContext) {
    for (let i = 0; i < MAX_SLOTS; i++) {
      const idx = i;
      const handler = () => {
        const win = this.windowData[idx];
        if (win) {
          switchToWindow(win.title, win.pid, win.windowIndex).catch((err: any) => {
            vscode.window.showErrorMessage(`Failed to switch: ${err.message}`);
          });
        }
      };
      this.disposables.push(
        vscode.commands.registerCommand(`switchItEasy.slot${idx}`, handler),
        vscode.commands.registerCommand(`switchItEasy.slot${idx}cur`, handler),
      );
    }
  }

  async refresh(): Promise<void> {
    let windows: WindowInfo[];
    try {
      windows = await discoverWindows();
    } catch {
      windows = [];
    }

    this.windowData = windows;

    for (let i = 0; i < MAX_SLOTS; i++) {
      const win = windows[i];
      const visible = !!win;
      const current = visible && win.isCurrent;
      vscode.commands.executeCommand('setContext', `switchItEasy.slot${i}visible`, visible);
      vscode.commands.executeCommand('setContext', `switchItEasy.slot${i}current`, current);
    }
  }

  dispose(): void {
    for (let i = 0; i < MAX_SLOTS; i++) {
      vscode.commands.executeCommand('setContext', `switchItEasy.slot${i}visible`, false);
      vscode.commands.executeCommand('setContext', `switchItEasy.slot${i}current`, false);
    }
    this.disposables.forEach(d => d.dispose());
    this.disposables = [];
  }
}
