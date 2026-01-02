# ChatGPT Hello World App

A simple test application built using the [OpenAI Apps SDK](https://developers.openai.com/apps-sdk) and Model Context Protocol (MCP). This app demonstrates the basics of building and deploying a ChatGPT app.

## What This App Does

This Hello World app includes 4 simple tools that ChatGPT can use:

| Tool | Description |
|------|-------------|
| `say_hello` | Returns a personalized greeting |
| `get_random_fact` | Displays a random fun fact |
| `calculate` | Performs basic math operations (add, subtract, multiply, divide) |
| `get_time` | Shows the current time in any timezone |

Each tool renders a custom UI widget inside ChatGPT's interface.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **ngrok** for tunneling ([download](https://ngrok.com/download))
- **ChatGPT Plus or Pro account** (required for custom apps/developer mode)

## Project Structure

```
chatgpt-app-tst/
├── src/
│   ├── server/
│   │   └── index.ts      # MCP server with tool definitions
│   └── widget/
│       └── index.tsx     # React widget source (optional TypeScript)
├── dist/
│   ├── server/           # Compiled server (after build)
│   └── widget/
│       ├── app.html      # Widget UI served to ChatGPT
│       └── test.html     # Local test page for browser preview
├── test-simple.js        # Automated test script
├── package.json
├── tsconfig.json
└── README.md
```

## Quick Start Guide

### Step 1: Install Dependencies

```bash
cd c:\git\chatgpt-app-tst
npm install
```

### Step 2: Build the Project

```bash
npm run build
```

This compiles the TypeScript server to JavaScript.

### Step 3: Start the Servers

You need to run **two servers** in separate terminals:

**Terminal 1 - Widget Server (serves the UI):**
```bash
npm run serve:widget
```
This starts a static file server at `http://localhost:4444`

**Terminal 2 - MCP Server (the app backend):**
```bash
npm start
```
This starts the MCP server at `http://localhost:8000`

You should see output like:
```
╔═══════════════════════════════════════════════════════════════╗
║           HelloWorld ChatGPT App - MCP Server                 ║
╠═══════════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:8000                     ║
║  MCP endpoint:      http://localhost:8000/mcp                 ║
...
```

### Step 4: Run Automated Tests

With both servers running, open a **third terminal** and run:

```bash
npm test
```

You should see all tests pass:
```
╔════════════════════════════════════════════════════════════╗
║       Simple HTTP Tests for Hello World MCP Server         ║
╚════════════════════════════════════════════════════════════╝

TEST 1: Root endpoint (/)
  ✅ Root endpoint returns app info with 4 tools

TEST 2: Health endpoint (/health)
  ✅ Health check passed

TEST 3: MCP endpoint (/mcp) responds
  ✅ MCP SSE endpoint responding correctly

TEST 4: Widget server (localhost:4444)
  ✅ Widget HTML served correctly

TEST 5: Widget JavaScript bundle
  ✅ Widget JavaScript bundle served correctly

TEST 6: CORS headers on MCP server
  ✅ CORS headers configured correctly

╔════════════════════════════════════════════════════════════╗
║  Results: 6 passed, 0 failed                              ║
╚════════════════════════════════════════════════════════════╝

🎉 All tests passed! Your server is ready for testing with ChatGPT.
```

**If any tests fail**, check that both servers are running before proceeding.

### Step 5: Preview Widget in Browser

Open http://localhost:4444/test in your browser to see an interactive test page.

This page:
- Simulates the ChatGPT environment locally
- Lets you click buttons to test all 4 tools visually
- Shows how the widget looks with different data
- Supports light/dark theme switching
- Logs all widget interactions

**Try clicking:**
- "Say Hello" - See the greeting widget
- "Random Fact" - See the fact widget
- "Calculate (42 × 17)" - See the calculator result
- "Current Time" - See the time widget

This is exactly how your widget will appear inside ChatGPT!

### Step 6: Expose Your Server with ngrok

Now that local testing passes, expose your server to the internet.

**Terminal 3:**
```bash
ngrok http 8000
```

You'll get a URL like: `https://abc123.ngrok-free.app`

**Keep this URL handy - you'll need it in the next step!**

### Step 7: Enable Developer Mode in ChatGPT

1. Go to [ChatGPT](https://chat.openai.com)
2. Click your profile icon → **Settings**
3. Navigate to **Beta features** or **Developer settings**
4. Enable **Developer mode** or **Custom connectors**

### Step 8: Add Your App as a Connector

1. In ChatGPT, go to **Settings** → **Connectors** (or similar)
2. Click **Add connector** or **Create connector**
3. Enter your connector details:
   - **Name:** Hello World App
   - **MCP URL:** `https://your-ngrok-url.ngrok-free.app/mcp`
   - (Replace with your actual ngrok URL)
4. Save the connector

### Step 9: Test Your App in ChatGPT!

1. Start a new chat in ChatGPT
2. Enable your "Hello World App" connector for this conversation
3. Try these prompts:

```
Say hello to me!
```

```
Tell me a random fun fact
```

```
What is 42 multiplied by 17?
```

```
What time is it in Tokyo?
```

## Development Workflow

### Making Changes

1. Edit files in `src/`
2. Rebuild: `npm run build`
3. Restart the MCP server: `npm start`
4. Run `npm test` to verify everything still works
5. Refresh your ChatGPT conversation

### Running Everything Together

For convenience, you can run both servers with:
```bash
npm run dev
```

(Runs the widget server and MCP server concurrently)

### Available npm Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript server and bundle widget |
| `npm run serve:widget` | Start widget static server on port 4444 |
| `npm start` | Start MCP server on port 8000 |
| `npm run dev` | Run both servers concurrently |
| `npm test` | Run automated tests |
| `npm run tunnel` | Start ngrok tunnel (if ngrok is in PATH) |

## How It Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         ChatGPT                                 │
├─────────────────────────────────────────────────────────────────┤
│  1. User sends message → ChatGPT decides to use a tool          │
│  2. ChatGPT calls your MCP server via the /mcp endpoint         │
│  3. Your server executes the tool and returns structured data   │
│  4. ChatGPT renders your widget in an iframe                    │
│  5. Widget displays the data using window.openai API            │
└─────────────────────────────────────────────────────────────────┘
         │                                      ▲
         ▼                                      │
┌─────────────────────┐              ┌─────────────────────┐
│    MCP Server       │              │   Widget Server     │
│  localhost:8000     │              │   localhost:4444    │
│                     │              │                     │
│  - Defines tools    │              │  - Serves app.html  │
│  - Handles requests │              │  - Static assets    │
│  - Returns data     │              │                     │
└─────────────────────┘              └─────────────────────┘
         │                                      ▲
         └──────────────────────────────────────┘
              Points widget URL to here
```

### Key Components

**MCP Server (`src/server/index.ts`)**
- Implements the Model Context Protocol
- Registers tools with descriptions and schemas
- Returns `structuredContent` for the widget
- Sets `_meta["openai/outputTemplate"]` to point to widget URL

**Widget (`dist/widget/app.html`)**
- Rendered inside ChatGPT's iframe
- Accesses data via `window.openai.toolOutput`
- Can call tools via `window.openai.callTool()`
- Adapts to light/dark theme via `window.openai.theme`

## Troubleshooting

### Tests fail: "Connection refused"

- Ensure both servers are running (widget on 4444, MCP on 8000)
- Check for port conflicts with other applications
- Try restarting the servers

### Widget not loading in ChatGPT

- Check browser console for errors
- Ensure CORS is enabled (the MCP server handles this)
- Verify the `WIDGET_BASE_URL` points to your widget server
- Make sure ngrok is still running

### Tools not appearing in ChatGPT

- Make sure developer mode is enabled
- Verify your connector is added and enabled for the conversation
- Check the ngrok logs for incoming requests
- Try recreating the connector with the correct URL

### ngrok session expired

- Free ngrok accounts have session limits
- Restart ngrok to get a new URL
- Update your ChatGPT connector with the new URL

### Widget looks wrong in browser test

- Make sure you're accessing http://localhost:4444/test (not /test.html)
- Try a hard refresh (Ctrl+Shift+R)
- Check browser console for JavaScript errors

## Next Steps

Once you have this working, you can:

1. **Add more tools** - Define new tools in `src/server/index.ts`
2. **Enhance the UI** - Improve the widget in `dist/widget/app.html`
3. **Add authentication** - See [Auth docs](https://developers.openai.com/apps-sdk/build/auth/)
4. **Deploy to production** - Host on Vercel, Railway, or similar

## Resources

- [OpenAI Apps SDK Documentation](https://developers.openai.com/apps-sdk/)
- [Building MCP Servers](https://developers.openai.com/apps-sdk/build/mcp-server/)
- [Building ChatGPT UI](https://developers.openai.com/apps-sdk/build/chatgpt-ui/)
- [Example Apps Repository](https://github.com/openai/openai-apps-sdk-examples)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## License

MIT
