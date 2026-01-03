// ChatGPT Widget for Hello World App
// This widget renders the UI inside ChatGPT's iframe

// Type definitions for window.openai API
interface OpenAIWidgetAPI {
  toolInput?: Record<string, unknown>;
  toolOutput?: {
    content?: Array<{ type: string; text?: string }>;
    structuredContent?: Record<string, unknown>;
  };
  theme?: "light" | "dark";
  locale?: string;
  displayMode?: string;
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  setWidgetState: (state: Record<string, unknown>) => void;
  getWidgetState: () => Record<string, unknown>;
  sendFollowUp: (message: string) => void;
  sendFollowUpMessage?: (opts: { prompt: string }) => void;
  requestFullscreen: () => void;
  exitFullscreen: () => void;
}

declare global {
  interface Window {
    openai?: OpenAIWidgetAPI;
  }
}

// Styles
const styles = `
  :root {
    --bg-primary: #ffffff;
    --bg-secondary: #f7f7f8;
    --text-primary: #1a1a1a;
    --text-secondary: #666666;
    --accent: #10a37f;
    --accent-hover: #0d8a6a;
    --border: #e5e5e5;
    --shadow: rgba(0, 0, 0, 0.1);
  }

  [data-theme="dark"] {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --text-primary: #ffffff;
    --text-secondary: #a0a0a0;
    --accent: #10a37f;
    --accent-hover: #14b88a;
    --border: #404040;
    --shadow: rgba(0, 0, 0, 0.3);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    padding: 16px;
    min-height: 100vh;
  }

  .widget-container {
    max-width: 500px;
    margin: 0 auto;
  }

  .widget-container.dashboard {
    max-width: 600px;
  }

  .widget-card {
    background: var(--bg-secondary);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px var(--shadow);
    border: 1px solid var(--border);
  }

  .widget-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }

  .widget-icon {
    width: 40px;
    height: 40px;
    background: var(--accent);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  .widget-title {
    font-size: 18px;
    font-weight: 600;
  }

  .widget-subtitle {
    font-size: 12px;
    color: var(--text-secondary);
  }

  .content-section {
    margin-bottom: 16px;
  }

  .content-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }

  .content-value {
    font-size: 16px;
    line-height: 1.5;
    color: var(--text-primary);
  }

  .content-value.large {
    font-size: 28px;
    font-weight: 600;
    color: var(--accent);
  }

  .calculation-display {
    font-family: 'SF Mono', Monaco, 'Courier New', monospace;
    background: var(--bg-primary);
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 18px;
    text-align: center;
    border: 1px solid var(--border);
  }

  .fact-box {
    background: var(--bg-primary);
    padding: 16px;
    border-radius: 8px;
    border-left: 4px solid var(--accent);
    font-style: italic;
    line-height: 1.6;
  }

  .time-display {
    text-align: center;
    padding: 16px;
  }

  .time-main {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .time-zone {
    font-size: 14px;
    color: var(--text-secondary);
  }

  .greeting-display {
    text-align: center;
    padding: 20px;
  }

  .greeting-emoji {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .greeting-message {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .greeting-timestamp {
    font-size: 12px;
    color: var(--text-secondary);
  }

  .button-row {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }

  .widget-button {
    flex: 1;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .widget-button.primary {
    background: var(--accent);
    color: white;
  }

  .widget-button.primary:hover {
    background: var(--accent-hover);
  }

  .widget-button.secondary {
    background: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border);
  }

  .widget-button.secondary:hover {
    background: var(--border);
  }

  .no-data {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary);
  }

  .no-data-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .no-data-text {
    font-size: 16px;
  }

  .footer-info {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
    font-size: 11px;
    color: var(--text-secondary);
    text-align: center;
  }

  /* Dashboard styles */
  .dashboard-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 16px;
  }

  .stat-card {
    background: var(--bg-primary);
    padding: 12px;
    border-radius: 8px;
    border: 1px solid var(--border);
  }

  .stat-value {
    font-size: 20px;
    font-weight: 700;
    color: var(--accent);
  }

  .stat-label {
    font-size: 11px;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .chart-container {
    background: var(--bg-primary);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    border: 1px solid var(--border);
  }

  .chart-title {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .bar-chart {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .bar-row {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .bar-row:hover {
    background: var(--bg-secondary);
  }

  .bar-label {
    width: 100px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bar-track {
    flex: 1;
    height: 24px;
    background: var(--bg-secondary);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 8px;
  }

  .bar-value {
    font-size: 11px;
    font-weight: 600;
    color: white;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }

  .period-selector {
    display: flex;
    gap: 4px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .period-btn {
    padding: 6px 12px;
    border: 1px solid var(--border);
    background: var(--bg-primary);
    color: var(--text-primary);
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .period-btn:hover {
    background: var(--border);
  }

  .period-btn.active {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }

  .product-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .product-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--bg-primary);
    border-radius: 8px;
    border: 1px solid var(--border);
  }

  .product-rank {
    width: 24px;
    height: 24px;
    background: var(--accent);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
  }

  .product-info {
    flex: 1;
  }

  .product-name {
    font-weight: 600;
    font-size: 14px;
  }

  .product-category {
    font-size: 11px;
    color: var(--text-secondary);
  }

  .product-stats {
    text-align: right;
  }

  .product-sales {
    font-weight: 600;
    font-size: 14px;
  }

  .product-growth {
    font-size: 11px;
  }

  .product-growth.positive {
    color: #10a37f;
  }

  .product-growth.negative {
    color: #ef4444;
  }

  .region-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .region-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .region-name {
    font-size: 18px;
    font-weight: 600;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 16px;
  }

  .metric-card {
    background: var(--bg-primary);
    padding: 12px;
    border-radius: 8px;
    border: 1px solid var(--border);
  }

  .metric-value {
    font-size: 18px;
    font-weight: 700;
  }

  .metric-value.positive {
    color: #10a37f;
  }

  .metric-value.negative {
    color: #ef4444;
  }

  .metric-label {
    font-size: 11px;
    color: var(--text-secondary);
    text-transform: uppercase;
  }

  .mini-chart {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 60px;
    padding: 8px 0;
  }

  .mini-bar {
    flex: 1;
    background: var(--accent);
    border-radius: 2px 2px 0 0;
    min-height: 4px;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .mini-bar:hover {
    opacity: 1;
  }

  .ask-ai-section {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
  }

  .ask-ai-btn {
    width: 100%;
    padding: 10px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .ask-ai-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

// Get the type of content from structuredContent
function getContentType(data: Record<string, unknown> | undefined): string {
  if (!data) return "unknown";
  return (data.type as string) || "unknown";
}

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Format currency
function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return "$" + (value / 1000000).toFixed(1) + "M";
  } else if (value >= 1000) {
    return "$" + (value / 1000).toFixed(0) + "K";
  }
  return "$" + value;
}

// Get icon for content type
function getIcon(type: string): string {
  const icons: Record<string, string> = {
    greeting: "👋",
    fact: "💡",
    calculation: "🔢",
    time: "🕐",
    dashboard: "📊",
    region_detail: "🗺️",
    top_products: "🏆",
    unknown: "🚀",
  };
  return icons[type] || icons.unknown;
}

// Get title for content type
function getTitle(type: string): string {
  const titles: Record<string, string> = {
    greeting: "Greeting",
    fact: "Fun Fact",
    calculation: "Calculator",
    time: "Current Time",
    dashboard: "Sales Dashboard",
    region_detail: "Regional Sales",
    top_products: "Top Products",
    unknown: "Hello World",
  };
  return titles[type] || titles.unknown;
}

// Render greeting content
function renderGreeting(data: Record<string, unknown>): string {
  const name = (data.name as string) || "World";
  const timestamp = data.timestamp as string;
  const formattedTime = timestamp ? new Date(timestamp).toLocaleString() : "";

  return `
    <div class="greeting-display">
      <div class="greeting-emoji">👋</div>
      <div class="greeting-message">Hello, ${escapeHtml(name)}!</div>
      <div class="greeting-timestamp">Generated at ${formattedTime}</div>
    </div>
    <div class="button-row">
      <button class="widget-button primary" onclick="sayHelloAgain()">Say Hello Again</button>
      <button class="widget-button secondary" onclick="getRandomFact()">Get a Fact</button>
    </div>
  `;
}

// Render fact content
function renderFact(data: Record<string, unknown>): string {
  const fact = (data.fact as string) || "No fact available";

  return `
    <div class="content-section">
      <div class="content-label">Did You Know?</div>
      <div class="fact-box">${escapeHtml(fact)}</div>
    </div>
    <div class="button-row">
      <button class="widget-button primary" onclick="getRandomFact()">Another Fact</button>
      <button class="widget-button secondary" onclick="sayHello()">Say Hello</button>
    </div>
  `;
}

// Render calculation content
function renderCalculation(data: Record<string, unknown>): string {
  const expression = (data.expression as string) || "0 + 0 = 0";

  return `
    <div class="content-section">
      <div class="content-label">Calculation Result</div>
      <div class="calculation-display">${escapeHtml(expression)}</div>
    </div>
    <div class="button-row">
      <button class="widget-button secondary" onclick="sayHello()">Say Hello</button>
      <button class="widget-button secondary" onclick="getRandomFact()">Get a Fact</button>
    </div>
  `;
}

// Render time content
function renderTime(data: Record<string, unknown>): string {
  const formatted = (data.formatted as string) || new Date().toLocaleString();
  const timezone = (data.timezone as string) || "UTC";

  return `
    <div class="time-display">
      <div class="time-main">${escapeHtml(formatted)}</div>
      <div class="time-zone">Timezone: ${escapeHtml(timezone)}</div>
    </div>
    <div class="button-row">
      <button class="widget-button primary" onclick="getTime()">Refresh Time</button>
      <button class="widget-button secondary" onclick="getRandomFact()">Get a Fact</button>
    </div>
  `;
}

// Render no data state
function renderNoData(): string {
  return `
    <div class="no-data">
      <div class="no-data-icon">🚀</div>
      <div class="no-data-text">Hello World App is ready!</div>
    </div>
    <div class="button-row">
      <button class="widget-button primary" onclick="sayHello()">Say Hello</button>
      <button class="widget-button secondary" onclick="getSalesDashboard()">Sales Dashboard</button>
    </div>
  `;
}

// Dashboard rendering
function renderDashboard(data: Record<string, unknown>): string {
  const regions = (data.regions as Array<{ id: string; name: string; color: string; sales: number }>) || [];
  const totalSales = (data.totalSales as number) || 0;
  const period = (data.period as string) || "ytd";
  const maxSales = Math.max(...regions.map((r) => r.sales));
  const topRegion = regions.reduce((max, r) => (r.sales > max.sales ? r : max), regions[0]);

  const periodLabels: Record<string, string> = { q1: "Q1", q2: "Q2", q3: "Q3", q4: "Q4", ytd: "YTD" };

  const barsHtml = regions
    .map((region) => {
      const percentage = ((region.sales / maxSales) * 100).toFixed(0);
      return `
      <div class="bar-row" onclick="drillDownRegion('${region.id}')" title="Click to see ${region.name} details">
        <div class="bar-label">${escapeHtml(region.name)}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${percentage}%; background: ${region.color};">
            <span class="bar-value">${formatCurrency(region.sales)}</span>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  const periodBtns = Object.entries(periodLabels)
    .map(
      ([key, label]) => `
    <button class="period-btn ${period === key ? "active" : ""}" onclick="changePeriod('${key}')">${label}</button>
  `
    )
    .join("");

  return `
    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-value">${formatCurrency(totalSales)}</div>
        <div class="stat-label">Total Revenue</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${regions.length}</div>
        <div class="stat-label">Regions</div>
      </div>
    </div>

    <div class="period-selector">
      ${periodBtns}
    </div>

    <div class="chart-container">
      <div class="chart-title">Sales by Region (${periodLabels[period]})</div>
      <div class="bar-chart">
        ${barsHtml}
      </div>
    </div>

    <div class="button-row">
      <button class="widget-button primary" onclick="getTopProducts()">Top Products</button>
      <button class="widget-button secondary" onclick="drillDownRegion('${topRegion?.id || "na"}')">Explore ${topRegion?.name || "Region"}</button>
    </div>

    <div class="ask-ai-section">
      <button class="ask-ai-btn" onclick="askAI('What insights can you provide about these sales figures? Which regions should we focus on?')">
        ✨ Ask AI for Insights
      </button>
    </div>
  `;
}

// Region detail rendering
function renderRegionDetail(data: Record<string, unknown>): string {
  const region = (data.region as { id: string; name: string; color: string }) || {};
  const monthlyData = (data.monthlyData as Array<{ month: string; sales: number }>) || [];
  const totalSales = (data.totalSales as number) || 0;
  const qoqGrowth = (data.qoqGrowth as number) || 0;
  const bestMonth = (data.bestMonth as { month: string; sales: number }) || {};
  const worstMonth = (data.worstMonth as { month: string; sales: number }) || {};
  const maxMonthSales = Math.max(...monthlyData.map((m) => m.sales));

  const miniBarsHtml = monthlyData
    .map((m) => {
      const height = ((m.sales / maxMonthSales) * 100).toFixed(0);
      return `<div class="mini-bar" style="height: ${height}%; background: ${region.color};" title="${m.month}: ${formatCurrency(m.sales)}"></div>`;
    })
    .join("");

  return `
    <div class="region-header">
      <div class="region-color" style="background: ${region.color};"></div>
      <div class="region-name">${escapeHtml(region.name || "Unknown")}</div>
    </div>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-value">${formatCurrency(totalSales)}</div>
        <div class="metric-label">YTD Revenue</div>
      </div>
      <div class="metric-card">
        <div class="metric-value ${qoqGrowth >= 0 ? "positive" : "negative"}">${qoqGrowth >= 0 ? "+" : ""}${qoqGrowth}%</div>
        <div class="metric-label">Q4 vs Q3 Growth</div>
      </div>
      <div class="metric-card">
        <div class="metric-value positive">${bestMonth.month || "N/A"}</div>
        <div class="metric-label">Best Month (${formatCurrency(bestMonth.sales || 0)})</div>
      </div>
      <div class="metric-card">
        <div class="metric-value negative">${worstMonth.month || "N/A"}</div>
        <div class="metric-label">Lowest Month (${formatCurrency(worstMonth.sales || 0)})</div>
      </div>
    </div>

    <div class="chart-container">
      <div class="chart-title">Monthly Trend</div>
      <div class="mini-chart">
        ${miniBarsHtml}
      </div>
    </div>

    <div class="button-row">
      <button class="widget-button primary" onclick="getSalesDashboard()">Back to Dashboard</button>
      <button class="widget-button secondary" onclick="getTopProducts()">Top Products</button>
    </div>

    <div class="ask-ai-section">
      <button class="ask-ai-btn" onclick="askAI('Analyze the ${region.name} sales performance. What trends do you see and what recommendations do you have?')">
        ✨ Analyze ${region.name} Performance
      </button>
    </div>
  `;
}

// Top products rendering
function renderTopProducts(data: Record<string, unknown>): string {
  const products = (data.products as Array<{ id: number; name: string; category: string; sales: number; units: number; growth: number }>) || [];
  const sortBy = (data.sortBy as string) || "sales";
  const totalRevenue = (data.totalRevenue as number) || 0;

  const productsHtml = products
    .map((product, index) => {
      const growthClass = product.growth >= 0 ? "positive" : "negative";
      const growthSign = product.growth >= 0 ? "+" : "";
      return `
      <div class="product-item">
        <div class="product-rank">${index + 1}</div>
        <div class="product-info">
          <div class="product-name">${escapeHtml(product.name)}</div>
          <div class="product-category">${escapeHtml(product.category)} • ${product.units.toLocaleString()} units</div>
        </div>
        <div class="product-stats">
          <div class="product-sales">${formatCurrency(product.sales)}</div>
          <div class="product-growth ${growthClass}">${growthSign}${product.growth}%</div>
        </div>
      </div>
    `;
    })
    .join("");

  return `
    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-value">${formatCurrency(totalRevenue)}</div>
        <div class="stat-label">Combined Revenue</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${products.length}</div>
        <div class="stat-label">Products Shown</div>
      </div>
    </div>

    <div class="content-section">
      <div class="content-label">Ranked by ${sortBy}</div>
      <div class="product-list">
        ${productsHtml}
      </div>
    </div>

    <div class="button-row">
      <button class="widget-button primary" onclick="getSalesDashboard()">Back to Dashboard</button>
      <button class="widget-button secondary" onclick="getTopProducts('growth')">Sort by Growth</button>
    </div>

    <div class="ask-ai-section">
      <button class="ask-ai-btn" onclick="askAI('Which of these products should we invest more in? What does the growth rate tell us about market trends?')">
        ✨ Get Product Strategy
      </button>
    </div>
  `;
}

// Tool call helpers (exposed globally for button onclick handlers)
(window as unknown as Record<string, unknown>).sayHello = async () => {
  if (window.openai?.callTool) {
    await window.openai.callTool("say_hello", { name: "Friend" });
  } else if (window.openai?.sendFollowUp) {
    window.openai.sendFollowUp("Say hello to me!");
  }
};

(window as unknown as Record<string, unknown>).sayHelloAgain = async () => {
  if (window.openai?.callTool) {
    const names = ["Friend", "World", "Developer", "Human", "ChatGPT User"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    await window.openai.callTool("say_hello", { name: randomName });
  } else if (window.openai?.sendFollowUp) {
    window.openai.sendFollowUp("Say hello again with a different name!");
  }
};

(window as unknown as Record<string, unknown>).getRandomFact = async () => {
  if (window.openai?.callTool) {
    await window.openai.callTool("get_random_fact", {});
  } else if (window.openai?.sendFollowUp) {
    window.openai.sendFollowUp("Tell me a random fun fact!");
  }
};

(window as unknown as Record<string, unknown>).getTime = async () => {
  if (window.openai?.callTool) {
    await window.openai.callTool("get_time", {});
  } else if (window.openai?.sendFollowUp) {
    window.openai.sendFollowUp("What time is it?");
  }
};

// Dashboard tool helpers
(window as unknown as Record<string, unknown>).getSalesDashboard = async (period?: string) => {
  if (window.openai?.callTool) {
    await window.openai.callTool("get_sales_dashboard", period ? { period } : {});
  } else if (window.openai?.sendFollowUp) {
    window.openai.sendFollowUp("Show me the sales dashboard");
  }
};

(window as unknown as Record<string, unknown>).changePeriod = async (period: string) => {
  if (window.openai?.setWidgetState) {
    window.openai.setWidgetState({ selectedPeriod: period });
  }
  const getSalesDashboard = (window as unknown as Record<string, (p?: string) => Promise<void>>).getSalesDashboard;
  await getSalesDashboard(period);
};

(window as unknown as Record<string, unknown>).drillDownRegion = async (regionId: string) => {
  if (window.openai?.callTool) {
    await window.openai.callTool("get_sales_by_region", { region: regionId });
  } else if (window.openai?.sendFollowUp) {
    const regionNames: Record<string, string> = { na: "North America", eu: "Europe", apac: "Asia Pacific", latam: "Latin America" };
    window.openai.sendFollowUp(`Show me sales details for ${regionNames[regionId] || regionId}`);
  }
};

(window as unknown as Record<string, unknown>).getTopProducts = async (sortBy?: string) => {
  if (window.openai?.callTool) {
    await window.openai.callTool("get_top_products", sortBy ? { sortBy } : {});
  } else if (window.openai?.sendFollowUp) {
    window.openai.sendFollowUp("Show me the top selling products");
  }
};

(window as unknown as Record<string, unknown>).askAI = async (question: string) => {
  if (window.openai?.sendFollowUp) {
    window.openai.sendFollowUp(question);
  } else if (window.openai?.sendFollowUpMessage) {
    window.openai.sendFollowUpMessage({ prompt: question });
  }
};

// Main render function
function render(): void {
  const root = document.getElementById("root");
  if (!root) return;

  const openai = window.openai;
  const theme = openai?.theme || "light";
  const structuredContent = openai?.toolOutput?.structuredContent;
  const contentType = getContentType(structuredContent);

  // Set theme
  document.documentElement.setAttribute("data-theme", theme);

  // Check if this is a dashboard view (needs wider container)
  const isDashboard = ["dashboard", "region_detail", "top_products"].includes(contentType);

  let contentHtml = "";
  if (structuredContent) {
    switch (contentType) {
      case "greeting":
        contentHtml = renderGreeting(structuredContent);
        break;
      case "fact":
        contentHtml = renderFact(structuredContent);
        break;
      case "calculation":
        contentHtml = renderCalculation(structuredContent);
        break;
      case "time":
        contentHtml = renderTime(structuredContent);
        break;
      case "dashboard":
        contentHtml = renderDashboard(structuredContent);
        break;
      case "region_detail":
        contentHtml = renderRegionDetail(structuredContent);
        break;
      case "top_products":
        contentHtml = renderTopProducts(structuredContent);
        break;
      default:
        contentHtml = renderNoData();
    }
  } else {
    contentHtml = renderNoData();
  }

  root.innerHTML = `
    <div class="widget-container ${isDashboard ? "dashboard" : ""}">
      <div class="widget-card">
        <div class="widget-header">
          <div class="widget-icon">${getIcon(contentType)}</div>
          <div>
            <div class="widget-title">${getTitle(contentType)}</div>
            <div class="widget-subtitle">ChatGPT Hello World App</div>
          </div>
        </div>
        ${contentHtml}
        <div class="footer-info">
          Powered by OpenAI Apps SDK
        </div>
      </div>
    </div>
  `;
}

// Initialize
function init(): void {
  // Inject styles
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Wait a brief moment for parent to inject window.openai (for test page)
  setTimeout(() => {
    // Initial render
    render();

    // Re-render when openai data changes (poll for changes)
    let lastOutput = JSON.stringify(window.openai?.toolOutput);
    setInterval(() => {
      const currentOutput = JSON.stringify(window.openai?.toolOutput);
      if (currentOutput !== lastOutput) {
        lastOutput = currentOutput;
        render();
      }
    }, 100);
  }, 50);
}

// Wait for DOM and initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
