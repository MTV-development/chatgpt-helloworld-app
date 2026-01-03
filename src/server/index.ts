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

  // ============================================================
  // SALES DASHBOARD TOOLS - Interactive data visualization demo
  // ============================================================

  // Sample sales data (simulating a real database)
  const salesData = {
    regions: [
      { id: "na", name: "North America", color: "#10a37f" },
      { id: "eu", name: "Europe", color: "#3b82f6" },
      { id: "apac", name: "Asia Pacific", color: "#f59e0b" },
      { id: "latam", name: "Latin America", color: "#ef4444" },
    ],
    quarterly: [
      { quarter: "Q1", na: 1250000, eu: 890000, apac: 720000, latam: 340000 },
      { quarter: "Q2", na: 1380000, eu: 920000, apac: 810000, latam: 380000 },
      { quarter: "Q3", na: 1420000, eu: 850000, apac: 890000, latam: 420000 },
      { quarter: "Q4", na: 1560000, eu: 980000, apac: 950000, latam: 460000 },
    ],
    products: [
      { id: 1, name: "Widget Pro", category: "Premium", sales: 2450000, units: 12000, growth: 15.2 },
      { id: 2, name: "Widget Basic", category: "Standard", sales: 1820000, units: 28000, growth: 8.5 },
      { id: 3, name: "Widget Enterprise", category: "Premium", sales: 1650000, units: 3200, growth: 22.1 },
      { id: 4, name: "Widget Lite", category: "Budget", sales: 980000, units: 45000, growth: -2.3 },
      { id: 5, name: "Widget Cloud", category: "SaaS", sales: 890000, units: 8500, growth: 45.8 },
    ],
    monthlyByRegion: {
      na: [
        { month: "Jan", sales: 380000 }, { month: "Feb", sales: 420000 }, { month: "Mar", sales: 450000 },
        { month: "Apr", sales: 440000 }, { month: "May", sales: 460000 }, { month: "Jun", sales: 480000 },
        { month: "Jul", sales: 470000 }, { month: "Aug", sales: 490000 }, { month: "Sep", sales: 460000 },
        { month: "Oct", sales: 510000 }, { month: "Nov", sales: 520000 }, { month: "Dec", sales: 530000 },
      ],
      eu: [
        { month: "Jan", sales: 280000 }, { month: "Feb", sales: 290000 }, { month: "Mar", sales: 320000 },
        { month: "Apr", sales: 300000 }, { month: "May", sales: 310000 }, { month: "Jun", sales: 310000 },
        { month: "Jul", sales: 270000 }, { month: "Aug", sales: 260000 }, { month: "Sep", sales: 320000 },
        { month: "Oct", sales: 330000 }, { month: "Nov", sales: 340000 }, { month: "Dec", sales: 310000 },
      ],
      apac: [
        { month: "Jan", sales: 220000 }, { month: "Feb", sales: 240000 }, { month: "Mar", sales: 260000 },
        { month: "Apr", sales: 270000 }, { month: "May", sales: 280000 }, { month: "Jun", sales: 260000 },
        { month: "Jul", sales: 290000 }, { month: "Aug", sales: 300000 }, { month: "Sep", sales: 300000 },
        { month: "Oct", sales: 310000 }, { month: "Nov", sales: 320000 }, { month: "Dec", sales: 320000 },
      ],
      latam: [
        { month: "Jan", sales: 100000 }, { month: "Feb", sales: 110000 }, { month: "Mar", sales: 130000 },
        { month: "Apr", sales: 120000 }, { month: "May", sales: 130000 }, { month: "Jun", sales: 130000 },
        { month: "Jul", sales: 140000 }, { month: "Aug", sales: 140000 }, { month: "Sep", sales: 140000 },
        { month: "Oct", sales: 150000 }, { month: "Nov", sales: 160000 }, { month: "Dec", sales: 150000 },
      ],
    },
  };

  // Tool 5: Get Sales Dashboard - Main dashboard view
  server.tool(
    "get_sales_dashboard",
    "Display an interactive sales dashboard with charts showing sales by region. Use this when the user asks about sales, revenue, performance, or wants to see a dashboard.",
    {
      period: z.enum(["q1", "q2", "q3", "q4", "ytd"]).optional().describe("Time period to show. Defaults to YTD (year to date)."),
    },
    async ({ period }) => {
      const selectedPeriod = period || "ytd";

      // Calculate totals based on period
      let regionTotals: { id: string; name: string; color: string; sales: number }[];

      if (selectedPeriod === "ytd") {
        regionTotals = salesData.regions.map(region => {
          const total = salesData.quarterly.reduce((sum, q) => sum + (q[region.id as keyof typeof q] as number), 0);
          return { ...region, sales: total };
        });
      } else {
        const quarterIndex = parseInt(selectedPeriod.replace("q", "")) - 1;
        const quarterData = salesData.quarterly[quarterIndex];
        regionTotals = salesData.regions.map(region => ({
          ...region,
          sales: quarterData[region.id as keyof typeof quarterData] as number,
        }));
      }

      const totalSales = regionTotals.reduce((sum, r) => sum + r.sales, 0);
      const topRegion = regionTotals.reduce((max, r) => r.sales > max.sales ? r : max);

      return {
        content: [
          {
            type: "text",
            text: `Sales Dashboard (${selectedPeriod.toUpperCase()}): Total revenue is $${(totalSales / 1000000).toFixed(1)}M. ${topRegion.name} leads with $${(topRegion.sales / 1000000).toFixed(1)}M.`,
          },
        ],
        structuredContent: {
          type: "dashboard",
          period: selectedPeriod,
          totalSales,
          regions: regionTotals,
          quarterly: salesData.quarterly,
          timestamp: new Date().toISOString(),
        },
        _meta: {
          "openai/outputTemplate": `${WIDGET_BASE_URL}/widget/app.html`,
        },
      };
    }
  );

  // Tool 6: Get Sales By Region - Drill down into a specific region
  server.tool(
    "get_sales_by_region",
    "Get detailed sales breakdown for a specific region. Use this when the user asks about a specific region's performance (e.g., 'How is Europe doing?', 'Show me Asia sales').",
    {
      region: z.enum(["na", "eu", "apac", "latam"]).describe("Region ID: na (North America), eu (Europe), apac (Asia Pacific), latam (Latin America)"),
    },
    async ({ region }) => {
      const regionInfo = salesData.regions.find(r => r.id === region)!;
      const monthlyData = salesData.monthlyByRegion[region as keyof typeof salesData.monthlyByRegion];
      const totalSales = monthlyData.reduce((sum, m) => sum + m.sales, 0);
      const avgMonthlySales = totalSales / 12;
      const bestMonth = monthlyData.reduce((max, m) => m.sales > max.sales ? m : max);
      const worstMonth = monthlyData.reduce((min, m) => m.sales < min.sales ? m : min);

      // Calculate quarter-over-quarter growth
      const q4Sales = salesData.quarterly[3][region as keyof typeof salesData.quarterly[0]] as number;
      const q3Sales = salesData.quarterly[2][region as keyof typeof salesData.quarterly[0]] as number;
      const qoqGrowth = ((q4Sales - q3Sales) / q3Sales * 100).toFixed(1);

      return {
        content: [
          {
            type: "text",
            text: `${regionInfo.name} Sales: Total YTD revenue is $${(totalSales / 1000000).toFixed(2)}M. Best month was ${bestMonth.month} ($${(bestMonth.sales / 1000).toFixed(0)}K). Q4 vs Q3 growth: ${qoqGrowth}%.`,
          },
        ],
        structuredContent: {
          type: "region_detail",
          region: regionInfo,
          monthlyData,
          totalSales,
          avgMonthlySales,
          bestMonth,
          worstMonth,
          qoqGrowth: parseFloat(qoqGrowth),
          timestamp: new Date().toISOString(),
        },
        _meta: {
          "openai/outputTemplate": `${WIDGET_BASE_URL}/widget/app.html`,
        },
      };
    }
  );

  // Tool 7: Get Top Products - Show best selling products
  server.tool(
    "get_top_products",
    "Show top selling products with sales figures and growth rates. Use this when the user asks about products, best sellers, or product performance.",
    {
      limit: z.number().min(1).max(10).optional().describe("Number of products to show (1-10). Defaults to 5."),
      sortBy: z.enum(["sales", "units", "growth"]).optional().describe("Sort by: sales (revenue), units (quantity sold), or growth (percentage). Defaults to sales."),
    },
    async ({ limit, sortBy }) => {
      const count = limit || 5;
      const sort = sortBy || "sales";

      const sortedProducts = [...salesData.products].sort((a, b) => {
        if (sort === "growth") return b.growth - a.growth;
        return b[sort] - a[sort];
      }).slice(0, count);

      const totalRevenue = sortedProducts.reduce((sum, p) => sum + p.sales, 0);
      const topProduct = sortedProducts[0];

      return {
        content: [
          {
            type: "text",
            text: `Top ${count} Products (by ${sort}): ${topProduct.name} leads with $${(topProduct.sales / 1000000).toFixed(2)}M in sales (${topProduct.growth > 0 ? '+' : ''}${topProduct.growth}% growth).`,
          },
        ],
        structuredContent: {
          type: "top_products",
          products: sortedProducts,
          sortBy: sort,
          totalRevenue,
          timestamp: new Date().toISOString(),
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
    description: "A simple test app for the ChatGPT Apps SDK with interactive sales dashboard",
    endpoints: {
      mcp: "/mcp",
      health: "/health",
    },
    tools: [
      { name: "say_hello", description: "Get a personalized greeting" },
      { name: "get_random_fact", description: "Get a random fun fact" },
      { name: "calculate", description: "Perform simple calculations" },
      { name: "get_time", description: "Get the current time" },
      { name: "get_sales_dashboard", description: "Interactive sales dashboard with charts" },
      { name: "get_sales_by_region", description: "Detailed regional sales breakdown" },
      { name: "get_top_products", description: "Top selling products" },
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
║    • say_hello        - Get a personalized greeting           ║
║    • get_random_fact  - Get a random fun fact                 ║
║    • calculate        - Perform simple calculations           ║
║    • get_time         - Get the current time                  ║
║  Dashboard Tools:                                             ║
║    • get_sales_dashboard - Interactive sales charts           ║
║    • get_sales_by_region - Regional drill-down                ║
║    • get_top_products    - Product performance                ║
╠═══════════════════════════════════════════════════════════════╣
║  Next Steps (only ONE ngrok tunnel needed!):                  ║
║    1. Run: ngrok http ${PORT}                                    ║
║    2. Add the ngrok URL + /mcp as a connector in ChatGPT      ║
║       Example: https://abc123.ngrok-free.app/mcp              ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});
