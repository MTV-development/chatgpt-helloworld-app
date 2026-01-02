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

### Step 3: Start the Server

Start the MCP server (serves both MCP endpoint and widgets from a single port):

```bash
npm start
```

You should see output like:
```
╔═══════════════════════════════════════════════════════════════╗
║           HelloWorld ChatGPT App - MCP Server                 ║
╠═══════════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:8000                     ║
║  MCP endpoint:      http://localhost:8000/mcp                 ║
║  Widget served at:  http://localhost:8000/widget              ║
╠═══════════════════════════════════════════════════════════════╣
║  Available Tools:                                             ║
║    • say_hello      - Get a personalized greeting             ║
║    • get_random_fact - Get a random fun fact                  ║
║    • calculate      - Perform simple calculations             ║
║    • get_time       - Get the current time                    ║
╠═══════════════════════════════════════════════════════════════╣
║  Next Steps (only ONE ngrok tunnel needed!):                  ║
║    1. Run: ngrok http 8000                                    ║
║    2. Add the ngrok URL + /mcp as a connector in ChatGPT      ║
║       Example: https://abc123.ngrok-free.app/mcp              ║
╚═══════════════════════════════════════════════════════════════╝
```

### Step 4: Expose Your Server with ngrok

ChatGPT requires HTTPS. Use ngrok to create a public tunnel:

```bash
ngrok http 8000
```

You'll get a URL like: `https://abc123.ngrok-free.app`

**Keep this URL handy - you'll need it in the next step!**

### Step 5: Enable Developer Mode in ChatGPT

1. Go to [ChatGPT](https://chat.openai.com)
2. Click your profile icon → **Settings**
3. Navigate to **Beta features** or **Developer settings**
4. Enable **Developer mode** or **Custom connectors**

### Step 6: Add Your App as a Connector

1. In ChatGPT, go to **Settings** → **Connectors** (or similar)
2. Click **Add connector** or **Create connector**
3. Enter your connector details:
   - **Name:** Hello World App
   - **MCP URL:** `https://your-ngrok-url.ngrok-free.app/mcp`
   - **Authentication:** No Auth
   - Check "I understand and want to continue"
4. Click **Create**

**Important:** Make sure to add `/mcp` at the end of your ngrok URL!

### Step 7: Test Your App in ChatGPT!

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

## Local Testing (Optional)

### Preview Widget in Browser

You can test the widget UI locally before connecting to ChatGPT:

1. Start the server: `npm start`
2. Open http://localhost:8000/widget/app.html in your browser

For an interactive test page that simulates ChatGPT:
1. Start the widget server: `npm run serve:widget`
2. Open http://localhost:4444/test in your browser
3. Click the buttons to simulate different tool responses

### Run Automated Tests

With the server running:

```bash
npm test
```

This verifies:
- MCP server endpoints are responding
- Widget files are being served correctly
- CORS headers are configured
- SSE endpoint is working

## Development Workflow

### Making Changes

1. Edit files in `src/`
2. Rebuild: `npm run build`
3. Restart the MCP server: `npm start`
4. Refresh your ChatGPT conversation (you may need to recreate the connector if ngrok URL changed)

### Available npm Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript server and bundle widget |
| `npm start` | Start MCP server on port 8000 (serves widgets too) |
| `npm run serve:widget` | Start standalone widget server on port 4444 (for local testing) |
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
│  2. ChatGPT calls your MCP server via the /mcp endpoint (SSE)   │
│  3. Your server executes the tool and returns structured data   │
│  4. ChatGPT renders your widget in an iframe                    │
│  5. Widget displays the data using window.openai API            │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │      MCP Server         │
              │    localhost:8000       │
              │                         │
              │  GET /mcp      → SSE    │
              │  POST /mcp/message      │
              │  GET /widget/* → Static │
              └─────────────────────────┘
                            │
                            ▼
                       Single ngrok
                         tunnel
```

### Key Components

**MCP Server (`src/server/index.ts`)**
- Implements the Model Context Protocol via SSE transport
- Registers tools with descriptions and schemas
- Returns `structuredContent` for the widget
- Sets `_meta["openai/outputTemplate"]` to point to widget URL
- Serves widget files from `/widget` path

**Widget (`dist/widget/app.html`)**
- Rendered inside ChatGPT's iframe
- Accesses data via `window.openai.toolOutput`
- Can call tools via `window.openai.callTool()`
- Adapts to light/dark theme via `window.openai.theme`

### MCP Protocol Flow

1. ChatGPT establishes SSE connection to `GET /mcp`
2. Server responds with session ID in endpoint event
3. ChatGPT sends JSON-RPC messages to `POST /mcp/message?sessionId=xxx`
4. Server processes messages and sends responses via SSE stream

## Troubleshooting

### "Request timeout" when creating connector

- Make sure your server is running (`npm start`)
- Verify ngrok is running and showing the correct URL
- Check that you're using `/mcp` at the end of the URL
- Look at the server console for connection logs

### "Session not found" errors

- The SSE connection may have dropped - try recreating the connector
- Check ngrok logs for connection issues

### Widget not loading in ChatGPT

- Verify the widget is accessible at `https://your-ngrok-url/widget/app.html`
- Check browser console for errors
- Ensure CORS is enabled (the MCP server handles this)

### Tools not appearing in ChatGPT

- Make sure developer mode is enabled
- Verify your connector is added and enabled for the conversation
- Check the ngrok and server logs for incoming requests

### ngrok session expired

- Free ngrok accounts have session limits
- Restart ngrok to get a new URL
- **You'll need to recreate the connector** in ChatGPT with the new URL

## Next Steps

Once you have this working, you can:

1. **Add more tools** - Define new tools in `src/server/index.ts`
2. **Enhance the UI** - Improve the widget in `dist/widget/app.html`
3. **Add authentication** - See [Auth docs](https://developers.openai.com/apps-sdk/build/auth/)
4. **Deploy to production** - Host on Vercel, Railway, or similar with a stable URL

## Resources

- [OpenAI Apps SDK Documentation](https://developers.openai.com/apps-sdk/)
- [Building MCP Servers](https://developers.openai.com/apps-sdk/build/mcp-server/)
- [Building ChatGPT UI](https://developers.openai.com/apps-sdk/build/chatgpt-ui/)
- [Example Apps Repository](https://github.com/openai/openai-apps-sdk-examples)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## License

MIT
