import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const PORT = process.env.PORT || 8000;
// WIDGET_BASE_URL: If not set, widgets are served from same origin (recommended for single ngrok tunnel)
// Set this to a separate URL only if you want to serve widgets from a different server
const WIDGET_BASE_URL = process.env.WIDGET_BASE_URL || "";

// Create Express app
const app = express();
app.use(express.json());

// Enable CORS for ChatGPT
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Serve static widget files from /widget path
const widgetPath = path.join(__dirname, "..", "widget");
app.use("/widget", express.static(widgetPath));

// Store active transports by session ID
const transports = new Map<string, SSEServerTransport>();

// Create MCP server factory
function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "HelloWorld ChatGPT App",
    version: "1.0.0",
  });

  // Register the widget as a resource
  server.resource(
    "widget-bundle",
    "widget://helloworld/app.html",
    async () => {
      // Read the widget HTML or return a URL reference
      return {
        contents: [
          {
            uri: "widget://helloworld/app.html",
            mimeType: "text/html",
            text: getWidgetHtml(),
          },
        ],
      };
    }
  );

  // Tool 1: Say Hello - A simple greeting tool
  server.tool(
    "say_hello",
    "Use this when the user wants to see a greeting or test the Hello World app. Returns a personalized greeting message.",
    {
      name: z.string().optional().describe("The name to greet. If not provided, uses 'World'"),
    },
    async ({ name }) => {
      const greeting = name || "World";
      const timestamp = new Date().toISOString();

      return {
        content: [
          {
            type: "text",
            text: `Hello, ${greeting}! This greeting was generated at ${timestamp}`,
          },
        ],
        structuredContent: {
          type: "greeting",
          name: greeting,
          timestamp,
          message: `Hello, ${greeting}!`,
        },
        _meta: {
          "openai/outputTemplate": `${WIDGET_BASE_URL}/widget/app.html`,
        },
      };
    }
  );

  // Tool 2: Get Random Fact - Returns a fun fact
  server.tool(
    "get_random_fact",
    "Use this when the user wants to see a random fun fact or interesting information.",
    {},
    async () => {
      const facts = [
        "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible!",
        "Octopuses have three hearts and blue blood.",
        "A group of flamingos is called a 'flamboyance'.",
        "The shortest war in history lasted 38-45 minutes between Britain and Zanzibar.",
        "Bananas are berries, but strawberries aren't.",
        "There are more possible iterations of a game of chess than atoms in the observable universe.",
        "Cows have best friends and get stressed when separated.",
        "The inventor of the Pringles can is buried in one.",
      ];

      const randomFact = facts[Math.floor(Math.random() * facts.length)];
      const timestamp = new Date().toISOString();

      return {
        content: [
          {
            type: "text",
            text: randomFact,
          },
        ],
        structuredContent: {
          type: "fact",
          fact: randomFact,
          timestamp,
        },
        _meta: {
          "openai/outputTemplate": `${WIDGET_BASE_URL}/widget/app.html`,
        },
      };
    }
  );

  // Tool 3: Calculate - Simple calculator
  server.tool(
    "calculate",
    "Use this when the user wants to perform a simple calculation (add, subtract, multiply, divide).",
    {
      operation: z.enum(["add", "subtract", "multiply", "divide"]).describe("The mathematical operation to perform"),
      a: z.number().describe("The first number"),
      b: z.number().describe("The second number"),
    },
    async ({ operation, a, b }) => {
      let result: number;
      let symbol: string;

      switch (operation) {
        case "add":
          result = a + b;
          symbol = "+";
          break;
        case "subtract":
          result = a - b;
          symbol = "-";
          break;
        case "multiply":
          result = a * b;
          symbol = "×";
          break;
        case "divide":
          if (b === 0) {
            return {
              content: [{ type: "text", text: "Error: Cannot divide by zero!" }],
              isError: true,
            };
          }
          result = a / b;
          symbol = "÷";
          break;
      }

      return {
        content: [
          {
            type: "text",
            text: `${a} ${symbol} ${b} = ${result}`,
          },
        ],
        structuredContent: {
          type: "calculation",
          operation,
          a,
          b,
          result,
          expression: `${a} ${symbol} ${b} = ${result}`,
        },
        _meta: {
          "openai/outputTemplate": `${WIDGET_BASE_URL}/widget/app.html`,
        },
      };
    }
  );

  // Tool 4: Get Current Time
  server.tool(
    "get_time",
    "Use this when the user wants to know the current time or date.",
    {
      timezone: z.string().optional().describe("Timezone (e.g., 'America/New_York', 'Europe/London'). Defaults to UTC."),
    },
    async ({ timezone }) => {
      const tz = timezone || "UTC";
      let timeString: string;

      try {
        timeString = new Date().toLocaleString("en-US", {
          timeZone: tz,
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        });
      } catch {
        timeString = new Date().toLocaleString("en-US", {
          timeZone: "UTC",
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        });
      }

      return {
        content: [
          {
            type: "text",
            text: `Current time: ${timeString}`,
          },
        ],
        structuredContent: {
          type: "time",
          timezone: tz,
          formatted: timeString,
          iso: new Date().toISOString(),
        },
        _meta: {
          "openai/outputTemplate": `${WIDGET_BASE_URL}/widget/app.html`,
        },
      };
    }
  );

  return server;
}

// Get widget HTML content
function getWidgetHtml(): string {
  // For development, we'll return a reference to the served widget
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hello World Widget</title>
  <script type="module" src="${WIDGET_BASE_URL}/widget/app.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
}

// SSE endpoint for MCP - establishes the SSE connection
app.get("/mcp", async (req, res) => {
  console.log("New SSE connection established");

  const transport = new SSEServerTransport("/mcp/message", res);
  const server = createMcpServer();

  // Store transport by session ID (extracted from the endpoint URL the transport sends)
  // The SSEServerTransport sends an endpoint event with sessionId as query param
  const sessionId = transport.sessionId;
  transports.set(sessionId, transport);
  console.log("Session ID:", sessionId);

  // Connect server to transport
  await server.connect(transport);

  // Cleanup on close
  req.on("close", () => {
    console.log("SSE connection closed, session:", sessionId);
    transports.delete(sessionId);
  });
});

// Message endpoint for MCP - receives JSON-RPC messages from client
app.post("/mcp/message", async (req, res) => {
  const sessionId = req.query.sessionId as string;
  console.log("Received MCP message for session:", sessionId);

  const transport = transports.get(sessionId);
  if (!transport) {
    console.error("No transport found for session:", sessionId);
    res.status(404).json({ error: "Session not found" });
    return;
  }

  try {
    // Use the transport's handlePostMessage method to process the message
    await transport.handlePostMessage(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    server: "HelloWorld ChatGPT App",
    version: "1.0.0",
    widgetUrl: WIDGET_BASE_URL,
  });
});

// Root endpoint with info
app.get("/", (req, res) => {
  res.json({
    name: "HelloWorld ChatGPT App",
    description: "A simple test app for the ChatGPT Apps SDK",
    endpoints: {
      mcp: "/mcp",
      health: "/health",
    },
    tools: [
      { name: "say_hello", description: "Get a personalized greeting" },
      { name: "get_random_fact", description: "Get a random fun fact" },
      { name: "calculate", description: "Perform simple calculations" },
      { name: "get_time", description: "Get the current time" },
    ],
  });
});

// Start server
app.listen(PORT, () => {
  const widgetUrl = WIDGET_BASE_URL || `http://localhost:${PORT}`;
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║           HelloWorld ChatGPT App - MCP Server                 ║
╠═══════════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:${PORT}                     ║
║  MCP endpoint:      http://localhost:${PORT}/mcp                 ║
║  Widget served at:  http://localhost:${PORT}/widget              ║
╠═══════════════════════════════════════════════════════════════╣
║  Available Tools:                                             ║
║    • say_hello      - Get a personalized greeting             ║
║    • get_random_fact - Get a random fun fact                  ║
║    • calculate      - Perform simple calculations             ║
║    • get_time       - Get the current time                    ║
╠═══════════════════════════════════════════════════════════════╣
║  Next Steps (only ONE ngrok tunnel needed!):                  ║
║    1. Run: ngrok http ${PORT}                                    ║
║    2. Add the ngrok URL + /mcp as a connector in ChatGPT      ║
║       Example: https://abc123.ngrok-free.app/mcp              ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});
