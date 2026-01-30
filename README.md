# Switch It Easy — Instant Window Switcher for VS Code

> Stop wasting time hunting through your taskbar. Switch between VS Code windows with a single click, right from the editor title bar.

<p align="center">
  <img src="media/icon.png" alt="Switch It Easy" width="128" />
</p>

<p align="center">
  <img src="media/screenshot.png" alt="Switch It Easy in action — colorful window icons in the editor title bar" />
</p>

---

## The Problem

You're a developer. You have 5, 6, maybe 8 VS Code windows open at once — one per project. Switching between them means `Cmd+Tab` through a wall of identical VS Code icons, squinting at tiny window titles, or digging through Mission Control. It's slow, frustrating, and breaks your flow.

## The Solution

**Switch It Easy** puts colorful, distinct icons directly into your editor title bar — one per open window. Each window gets its own unique color. The current window glows with a solid fill. Other windows appear as subtle outlines. Click any icon — boom, you're there. No menus. No keyboard shortcuts to memorize. No context switching overhead.

---

## Features

- **Up to 10 windows** displayed as color-coded icons in the editor title bar
- **One-click switching** — click an icon, instantly jump to that window
- **Visual current window indicator** — solid filled icon for the active window, subtle outlines for others
- **Alphabetically sorted** by workspace name — consistent order across all your windows
- **Blazing fast** — native Swift binary for window discovery (~90ms) and switching (~150ms)
- **Auto-refresh** — window list updates every 5 seconds and on window focus
- **Works everywhere** — VS Code, Cursor, Windsurf, and other Electron-based editors
- **10 unique colors** from the One Dark palette — red, yellow, blue, green, purple, cyan, orange, dark red, bright blue, silver

## How It Works

1. **Install** the extension
2. **Grant Accessibility permission** to your editor (macOS will prompt you)
3. **Open multiple VS Code windows** — colored icons appear automatically in the editor title bar
4. **Click any icon** to switch to that window instantly

That's it. No configuration needed. No settings to tweak. It just works.

## Why Switch It Easy?

| Before | After |
|--------|-------|
| `Cmd+Tab` through 8 identical VS Code icons | One click on a distinct colored icon |
| Squinting at Mission Control thumbnails | Alphabetically sorted, always in the same position |
| 2-3 seconds to find the right window | ~150ms to switch — faster than your eye can blink |
| Breaking your flow every time | Stay in your editor, stay in the zone |

## Requirements

- **macOS** (uses native macOS Accessibility API — no Windows/Linux support yet)
- **Accessibility permission** — grant it to VS Code / Cursor in:
  `System Settings → Privacy & Security → Accessibility`

## Commands

| Command | Description |
|---------|-------------|
| `Switch It Easy: Refresh Windows` | Manually refresh the window list |

Windows are also auto-refreshed every 5 seconds and whenever your window regains focus.

## Technical Details

Under the hood, Switch It Easy uses a **precompiled Swift binary** that talks directly to the macOS Accessibility API (`AXUIElement`). This means:

- **No AppleScript overhead** — direct native API calls
- **Window discovery in ~90ms** — lists all open editor windows by PID and title
- **Window switching in ~150ms** — raises the target window by index, no title matching needed
- **Zero runtime dependencies** — the binary is bundled with the extension

## FAQ

**Q: Why macOS only?**
A: Window management APIs are platform-specific. macOS provides the Accessibility API which allows reliable window discovery and switching. Windows and Linux support may come in future versions.

**Q: Why do I need Accessibility permission?**
A: The extension needs to read window titles and switch focus between windows. macOS requires explicit user consent for this through Accessibility permissions.

**Q: Does it work with Cursor / Windsurf?**
A: Yes! It works with any Electron-based code editor — VS Code, Cursor, Windsurf, and others.

**Q: What if I have more than 10 windows?**
A: The extension displays up to 10 windows. They're sorted alphabetically by workspace name, so the first 10 in alphabetical order are shown.

**Q: Will it slow down my editor?**
A: No. The window discovery runs in a background process and takes ~90ms. The 5-second polling interval has negligible performance impact.

## Contributing

Found a bug? Have a feature request? [Open an issue on GitHub](https://github.com/phpdude/switch-it-easy/issues).

## License

[MIT](LICENSE) — use it, fork it, make it yours.
