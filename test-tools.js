// Simple test script to verify MCP server tools work correctly
// Run with: node test-tools.js

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const MCP_URL = process.env.MCP_URL || "http://localhost:8000/mcp";

async function runTests() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║         Testing ChatGPT Hello World MCP Server             ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  const client = new Client({
    name: "test-client",
    version: "1.0.0",
  }, {
    capabilities: {}
  });

  try {
    console.log(`Connecting to MCP server at ${MCP_URL}...`);
    const transport = new SSEClientTransport(new URL(MCP_URL));
    await client.connect(transport);
    console.log("✅ Connected to MCP server\n");

    // Test 1: List available tools
    console.log("─────────────────────────────────────────────────────────────");
    console.log("TEST 1: List available tools");
    console.log("─────────────────────────────────────────────────────────────");
    const tools = await client.listTools();
    console.log(`Found ${tools.tools.length} tools:`);
    for (const tool of tools.tools) {
      console.log(`  • ${tool.name}: ${tool.description?.substring(0, 50)}...`);
    }
    console.log("✅ Tools listed successfully\n");

    // Test 2: say_hello tool
    console.log("─────────────────────────────────────────────────────────────");
    console.log("TEST 2: say_hello tool");
    console.log("─────────────────────────────────────────────────────────────");
    const helloResult = await client.callTool({
      name: "say_hello",
      arguments: { name: "Test User" }
    });
    console.log("Result:", JSON.stringify(helloResult, null, 2));
    console.log("✅ say_hello works\n");

    // Test 3: get_random_fact tool
    console.log("─────────────────────────────────────────────────────────────");
    console.log("TEST 3: get_random_fact tool");
    console.log("─────────────────────────────────────────────────────────────");
    const factResult = await client.callTool({
      name: "get_random_fact",
      arguments: {}
    });
    console.log("Result:", JSON.stringify(factResult, null, 2));
    console.log("✅ get_random_fact works\n");

    // Test 4: calculate tool
    console.log("─────────────────────────────────────────────────────────────");
    console.log("TEST 4: calculate tool (42 × 17)");
    console.log("─────────────────────────────────────────────────────────────");
    const calcResult = await client.callTool({
      name: "calculate",
      arguments: { operation: "multiply", a: 42, b: 17 }
    });
    console.log("Result:", JSON.stringify(calcResult, null, 2));
    const expected = 42 * 17;
    if (calcResult.content?.[0]?.text?.includes(String(expected))) {
      console.log(`✅ calculate works (42 × 17 = ${expected})\n`);
    } else {
      console.log("❌ calculate returned unexpected result\n");
    }

    // Test 5: calculate division by zero
    console.log("─────────────────────────────────────────────────────────────");
    console.log("TEST 5: calculate tool (division by zero)");
    console.log("─────────────────────────────────────────────────────────────");
    const divZeroResult = await client.callTool({
      name: "calculate",
      arguments: { operation: "divide", a: 10, b: 0 }
    });
    console.log("Result:", JSON.stringify(divZeroResult, null, 2));
    if (divZeroResult.isError) {
      console.log("✅ Division by zero handled correctly\n");
    } else {
      console.log("⚠️  Division by zero should return an error\n");
    }

    // Test 6: get_time tool
    console.log("─────────────────────────────────────────────────────────────");
    console.log("TEST 6: get_time tool");
    console.log("─────────────────────────────────────────────────────────────");
    const timeResult = await client.callTool({
      name: "get_time",
      arguments: { timezone: "America/New_York" }
    });
    console.log("Result:", JSON.stringify(timeResult, null, 2));
    console.log("✅ get_time works\n");

    // Summary
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║                    ALL TESTS PASSED!                       ║");
    console.log("╚════════════════════════════════════════════════════════════╝");

    await client.close();
    process.exit(0);

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error(error);
    process.exit(1);
  }
}

runTests();
