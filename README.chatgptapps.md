# Building ChatGPT Apps with Visible Widgets

This document captures learnings from building a ChatGPT app with the OpenAI Apps SDK, focusing on displaying rich widget UIs in the conversation.

## Architecture Overview

ChatGPT apps have two components:

```
┌─────────────────────────────────────────────────────────────────┐
│                         ChatGPT                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Conversation                            │  │
│  │  User: "Start a 25 minute timer"                          │  │
│  │                                                            │  │
│  │  ChatGPT: Calls start_pomodoro tool                       │  │
│  │           ↓                                                │  │
│  │  ┌─────────────────────────────────┐                      │  │
│  │  │     Widget (iframe)              │  ← Your UI          │  │
│  │  │     ┌─────────────────────┐     │                      │  │
│  │  │     │    Pomodoro Timer   │     │                      │  │
│  │  │     │       23:45         │     │                      │  │
│  │  │     └─────────────────────┘     │                      │  │
│  │  └─────────────────────────────────┘                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↕                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              MCP Server (your backend)                     │  │
│  │   Tools: start_pomodoro, get_sales_dashboard, etc.        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

1. **MCP Server** - Exposes tools via the Model Context Protocol
2. **Widget** - HTML/JS that renders in an iframe inside ChatGPT

---

## Critical Learnings

### 1. The `text/html+skybridge` MIME Type

Your widget HTML must be registered as an MCP resource with MIME type `text/html+skybridge`. Without this, ChatGPT won't render it as a widget.

```javascript
server.registerResource(
  "app-widget",
  WIDGET_RESOURCE_URI,
  {},
  async () => ({
    contents: [{
      uri: WIDGET_RESOURCE_URI,
      mimeType: "text/html+skybridge",  // REQUIRED
      text: getWidgetHtml(),
    }],
  })
);
```

### 2. `toolOutput` IS the structuredContent

**WRONG:**
```javascript
const data = window.openai.toolOutput.structuredContent;  // undefined!
```

**CORRECT:**
```javascript
const data = window.openai.toolOutput;  // This IS your structuredContent
```

The documentation says `toolOutput` "contains your structuredContent" - but it **IS** the structuredContent directly, not an object with a `structuredContent` property.

### 3. `widgetState` is a Property, Not a Method

**WRONG:**
```javascript
const state = window.openai.getWidgetState();  // Method doesn't exist!
```

**CORRECT:**
```javascript
const state = window.openai.widgetState;  // It's a property
window.openai.setWidgetState(newState);   // This IS a method
```

### 4. `_meta.openai/outputTemplate` Goes in Tool Definition

Specify which widget template to use in the tool's `_meta`:

```javascript
server.registerTool(
  "start_pomodoro",
  {
    description: "Start a visual timer",
    inputSchema: { minutes: z.number() },
    _meta: {
      "openai/outputTemplate": "ui://widget/app.html",
      "openai/toolInvocation/invoking": "Starting timer...",
      "openai/toolInvocation/invoked": "Timer started!",
    },
  },
  async ({ minutes }) => {
    return {
      content: [{ type: "text", text: "Timer started" }],
      structuredContent: {
        type: "pomodoro",
        minutes: minutes,
        endTime: Date.now() + minutes * 60 * 1000,
      },
    };
  }
);
```

### 5. Widget Caching Behavior

**ChatGPT caches widget HTML when the connector is registered.** Code changes require:

1. Restart your MCP server
2. Disconnect the connector in ChatGPT Settings
3. Reconnect the connector
4. Start a new conversation

To help with cache busting, include a version in your resource URI:
```javascript
const BUILD_VERSION = "2026.01.03-B";
const WIDGET_RESOURCE_URI = `ui://widget/app-${BUILD_VERSION}.html`;
```

---

## window.openai API Reference

### Properties (Read)

| Property | Type | Description |
|----------|------|-------------|
| `toolOutput` | object | Your `structuredContent` from the tool response |
| `toolInput` | object | Arguments passed when tool was invoked |
| `widgetState` | object | Persisted UI state from previous renders |
| `theme` | `"light"` \| `"dark"` | Current ChatGPT theme |
| `displayMode` | string | Current display mode |
| `maxHeight` | number | Max height constraint (~480px in PiP) |
| `locale` | string | User's locale |

### Methods

| Method | Description |
|--------|-------------|
| `setWidgetState(state)` | Persist UI state for future renders |
| `callTool(name, args)` | Invoke another MCP tool from widget |
| `sendFollowUpMessage({ prompt })` | Send a message to the conversation |
| `requestDisplayMode({ mode })` | Request inline/pip/fullscreen |

---

## Tool Response Structure

```javascript
return {
  // Text for the model (appears in conversation)
  content: [{
    type: "text",
    text: "Human-readable description"
  }],

  // Data for the widget (becomes window.openai.toolOutput)
  structuredContent: {
    type: "pomodoro",      // Use this to switch rendering logic
    minutes: 25,
    endTime: 1735862400000,
    label: "Focus Session"
  },

  // Optional: Additional metadata
  _meta: {
    "openai/outputTemplate": WIDGET_RESOURCE_URI
  }
};
```

---

## Widget Code Pattern

```html
<!DOCTYPE html>
<html>
<head>
  <style>/* Your styles */</style>
</head>
<body>
  <div id="root"></div>
  <script>
    const VERSION = "2026.01.03-B";

    function render() {
      const openai = window.openai;
      const data = openai?.toolOutput;          // IS the structuredContent
      const savedState = openai?.widgetState;   // Property, not method
      const theme = openai?.theme || 'light';
      const contentType = data?.type || 'unknown';

      document.documentElement.setAttribute('data-theme', theme);

      let html = '';
      switch (contentType) {
        case 'pomodoro':
          html = renderPomodoro(data);
          break;
        case 'dashboard':
          html = renderDashboard(data);
          break;
        default:
          html = renderFallback();
      }

      document.getElementById('root').innerHTML = html;
    }

    // Initial render + poll for changes
    function init() {
      setTimeout(() => {
        render();
        let lastOutput = JSON.stringify(window.openai?.toolOutput);
        setInterval(() => {
          const current = JSON.stringify(window.openai?.toolOutput);
          if (current !== lastOutput) {
            lastOutput = current;
            render();
          }
        }, 100);
      }, 50);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  </script>
</body>
</html>
```

---

## Debugging Tips

### Server-Side Logging

```javascript
function debugLog(label, data) {
  const timestamp = new Date().toISOString().split("T")[1].slice(0, 12);
  console.log(`\n[${timestamp}] ${label}`);
  if (data) console.log(JSON.stringify(data, null, 2));
}

// Log tool calls
debugLog("TOOL CALLED: start_pomodoro", { minutes, label });
debugLog("TOOL RESPONSE", { structuredContent, _meta });
```

### Widget-Side Logging

```javascript
function debugLog(label, data) {
  console.log(`%c[Widget] ${label}`, 'color: #10a37f; font-weight: bold;', data || '');
}

// In render():
debugLog('RENDER', {
  hasOpenAI: !!window.openai,
  toolOutput: window.openai?.toolOutput,
  contentType: data?.type,
});
```

### Version Tracking

Include version in both server and widget to verify fresh deployments:

**Server:**
```javascript
const BUILD_VERSION = "2026.01.03-B";
// Include in resource URI for cache busting
const WIDGET_RESOURCE_URI = `ui://widget/app-${BUILD_VERSION}.html`;
```

**Widget:**
```javascript
const WIDGET_VERSION = "2026.01.03-B";
// Show in footer
`<div class="footer">v${WIDGET_VERSION}</div>`
```

**Version check tool:**
```javascript
server.registerTool("get_version", {
  description: "Check current app version",
  inputSchema: {},
}, async () => ({
  content: [{ type: "text", text: `Version: ${BUILD_VERSION}` }],
}));
```

---

## Common Pitfalls

| Problem | Cause | Solution |
|---------|-------|----------|
| Widget shows but wrong content | Accessing `toolOutput.structuredContent` | Use `toolOutput` directly |
| `getWidgetState not found` | Using method instead of property | Use `widgetState` property |
| Widget not appearing | Wrong MIME type | Use `text/html+skybridge` |
| Old widget code running | ChatGPT cached it | Disconnect/reconnect connector |
| All tools show same widget | Missing `type` in structuredContent | Add `type` field to switch rendering |

---

## Development Workflow

1. **Start server:** `npm start`
2. **Start tunnel:** `ngrok http 8000`
3. **Register in ChatGPT:** Settings → Connectors → Add `https://xxx.ngrok.io/mcp`
4. **Test:** "Start a 1 minute pomodoro timer"
5. **After code changes:**
   - Restart server
   - Disconnect/reconnect connector in ChatGPT
   - Start new conversation

---

## Resources

- [OpenAI Apps SDK Overview](https://developers.openai.com/apps-sdk/)
- [Build your ChatGPT UI](https://developers.openai.com/apps-sdk/build/chatgpt-ui/)
- [Build your MCP Server](https://developers.openai.com/apps-sdk/build/mcp-server/)
- [Official Examples (GitHub)](https://github.com/openai/openai-apps-sdk-examples)
