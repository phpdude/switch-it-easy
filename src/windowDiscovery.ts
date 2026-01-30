import { execFile } from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';
import { WindowInfo } from './types';

let binaryPath: string | undefined;

export function initDiscovery(extensionPath: string): void {
  binaryPath = path.join(extensionPath, 'bin', 'switch_window');
}

export function discoverWindows(): Promise<WindowInfo[]> {
  return new Promise((resolve, reject) => {
    if (!binaryPath) {
      reject(new Error('Binary not initialized'));
      return;
    }

    execFile(binaryPath, ['list'], { timeout: 3000 }, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }

      const activeFile = vscode.window.activeTextEditor?.document.fileName;
      const currentWorkspace = (vscode.workspace.name ?? '').replace(/\s*\(Workspace\)\s*$/, '').trim();
      const lines = stdout.trim().split('\n').filter(l => l.length > 0);

      const windows: WindowInfo[] = lines
        .map(line => {
          const parts = line.split('\t');
          if (parts.length < 3) { return null; }
          const pid = parseInt(parts[0], 10);
          const windowIndex = parseInt(parts[1], 10);
          const title = parts.slice(2).join('\t');
          return { pid, windowIndex, title };
        })
        .filter((e): e is { pid: number; windowIndex: number; title: string } => e !== null && e.title.includes('\u2014'))
        .map(({ pid, windowIndex, title }) => {
          const parts = title.split('\u2014');
          let workspaceName = (parts[parts.length - 1] || '').trim();
          workspaceName = workspaceName.replace(/\s*\(Workspace\)\s*$/, '').trim();

          let isCurrent = false;
          if (workspaceName === currentWorkspace) {
            if (activeFile) {
              const basename = activeFile.split('/').pop() ?? '';
              isCurrent = title.includes(basename);
            } else {
              isCurrent = true;
            }
          }

          return { title, workspaceName, isCurrent, pid, windowIndex };
        })
        .filter(w => w.workspaceName.length > 0)
        .sort((a, b) => a.workspaceName.localeCompare(b.workspaceName, undefined, { sensitivity: 'base' }));

      resolve(windows);
    });
  });
}
