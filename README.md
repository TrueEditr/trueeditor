# 🚀 TrueEditr: Smart. Slim. AI-Native.

TrueEditr is the next-gen WYSIWYG editor built for developers who want the power of AI without the bloat of traditional editors. Plug in your own AI keys, white-label everything, and get started for free.

## ✨ Why TrueEditr?

- **🤖 AI-Native & Universal**: AI features (Ghost Text, Popover) are now **enabled for all tiers**, including Free.
- **✨ Smart Formatting**: Auto-detects lists like `1.`, `a.`, `i.`, and `-`.
- **📦 Featherweight**: < 50KB gzipped. No heavy UI frameworks.
- **🛠 Pro Blocks**: Advanced tables, logic-aware code blocks, and beautiful callouts.
- **📝 Source Mode**: View and edit raw HTML with a single click.
- **📈 Built-in Analytics**: Track loads, AI usage, and user engagement from one dashboard.
- **🖼 Media Webhooks**: Complete control over your image storage with HMAC-signed webhooks.

## 🚀 Quick Start

### 1. Installation
#### Via NPM
```bash
npm install trueeditr
```

#### Via CDN (Fastest)
Add this to your `<head>`:
```html
<script src="https://trueeditr.in/v1/editor.js"></script>
```

### 2. Implementation
```javascript
import TrueEditr from 'trueeditr';

const editor = new TrueEditr({
  key: 'te_your_api_key', // Optional for local dev/free tier
  selector: '#editor-container',
  config: {
    placeholder: 'Start writing something amazing...',
    watermark: false // Standard for Pro users
  }
});
```

## 🛠 Advanced Features

### Smart Lists (v1.2.2)
TrueEditr now supports smart list detection. Type and space to trigger:
- `1. ` -> Ordered List (Numeric)
- `a. ` -> Ordered List (Alpha)
- `i. ` -> Ordered List (Roman)
- `- ` -> Unordered List (Bullet)
- `* ` -> Unordered List (Bullet)

**Pro Tips:**
- **Backspace to Undo**: If a list is automatically created and you didn't want it, just press `Backspace` immediately to revert to plain text.
- **Google Docs Style Tab**: Press `Tab` inside a list to indent, or `Shift+Tab` to outdent. 

### AI Assistant (Universal)
Press `Cmd+J` (or `Ctrl+J`), type `/ai`, or click the ✨ button to open the AI popover.
- **Ghost Text**: Suggestions appear as you type. Press `Tab` to accept.
- **Context Aware**: Select text to Rewrite, Summarize, or Fix Grammar.

### Pro Implementation (Tables, Code, Callouts)
Pro features are automatically enabled based on your API key's plan.

```javascript
const editor = new TrueEditr({
  key: 'te_pro_key',
  selector: '#editor-container'
});
```

### Media Uploads (Cloud Storage)
Configure your webhook in the dashboard, then enable uploads. TrueEditr will proxy the files to your backend with security headers.

## ⚙️ Configuration Options

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `key` | `string` | `null` | **Required** for Prod/Analytics. Optional for Dev. |
| `selector` | `string` | `null` | **Required.** CSS selector for the target element. |
| `apiUrl` | `string` | `"https://trueeditr.in/api"` | Base URL for the TrueEditr service. |

## 🌐 Dashboard & Enterprise
Manage your domains, check analytics, and upgrade to Pro at [trueeditr.in](https://trueeditr.in).

## 🔗 Links
- **Source Code**: [GitHub Repository](https://github.com/TrueEditr/trueeditor)
- **Bug Reports**: [GitHub Issues](https://github.com/TrueEditr/trueeditor/issues)

## � License
MIT © 2026 TrueEditr Team.
