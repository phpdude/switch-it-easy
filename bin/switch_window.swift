import Cocoa

// Usage:
//   switch_window list              — list "pid\tindex\ttitle" per line
//   switch_window raise PID INDEX   — raise window by index (no title search)

func listWindows() {
    let apps = NSWorkspace.shared.runningApplications
    for app in apps {
        let name = app.localizedName ?? ""
        let bundleId = app.bundleIdentifier ?? ""
        if name == "Electron" || name.contains("Code") || name.contains("Cursor")
            || bundleId.contains("cursor") || bundleId.contains("vscode") {
            let pid = app.processIdentifier
            let appRef = AXUIElementCreateApplication(pid)
            var windowsRef: CFTypeRef?
            AXUIElementCopyAttributeValue(appRef, kAXWindowsAttribute as CFString, &windowsRef)
            if let windows = windowsRef as? [AXUIElement] {
                for (i, window) in windows.enumerated() {
                    var titleRef: CFTypeRef?
                    AXUIElementCopyAttributeValue(window, kAXTitleAttribute as CFString, &titleRef)
                    if let title = titleRef as? String, !title.isEmpty {
                        print("\(pid)\t\(i)\t\(title)")
                    }
                }
            }
        }
    }
}

func raiseWindow(pid: Int32, index: Int) {
    let appRef = AXUIElementCreateApplication(pid)
    var windowsRef: CFTypeRef?
    AXUIElementCopyAttributeValue(appRef, kAXWindowsAttribute as CFString, &windowsRef)
    if let windows = windowsRef as? [AXUIElement], index < windows.count {
        AXUIElementPerformAction(windows[index], kAXRaiseAction as CFString)
    }
    if let app = NSRunningApplication(processIdentifier: pid) {
        app.activate()
    }
}

let args = CommandLine.arguments
if args.count >= 2 && args[1] == "list" {
    listWindows()
} else if args.count >= 4 && args[1] == "raise",
          let pid = Int32(args[2]),
          let idx = Int(args[3]) {
    raiseWindow(pid: pid, index: idx)
} else {
    fputs("Usage: switch_window list | switch_window raise PID INDEX\n", stderr)
    exit(1)
}
