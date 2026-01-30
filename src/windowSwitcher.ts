import { execFile } from 'child_process';
import * as path from 'path';

let binaryPath: string | undefined;

export function initSwitcher(extensionPath: string): void {
  binaryPath = path.join(extensionPath, 'bin', 'switch_window');
}

export function switchToWindow(windowTitle: string, pid?: number, windowIndex?: number): Promise<void> {
  // Fast path: precompiled Swift binary with index — ~150ms
  if (pid != null && windowIndex != null && binaryPath) {
    return new Promise((resolve, reject) => {
      execFile(binaryPath!, ['raise', String(pid), String(windowIndex)], { timeout: 3000 }, (error) => {
        if (error) { reject(error); } else { resolve(); }
      });
    });
  }

  // Fallback: AppleScript
  const escaped = windowTitle.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const script = `
tell application "System Events"
  set codeProcs to (processes whose name is "Electron" or name contains "Code")
  repeat with codeProc in codeProcs
    try
      set wins to every window of codeProc
      repeat with w in wins
        if name of w is "${escaped}" then
          perform action "AXRaise" of w
          set frontmost of codeProc to true
          return
        end if
      end repeat
    end try
  end repeat
end tell
`;
  return new Promise((resolve, reject) => {
    execFile('osascript', ['-e', script], { timeout: 5000 }, (error) => {
      if (error) { reject(error); } else { resolve(); }
    });
  });
}
