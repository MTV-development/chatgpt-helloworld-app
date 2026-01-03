// ChatGPT Widget for Hello World App
// This widget renders the UI inside ChatGPT's iframe
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

  /* Pomodoro Timer Styles */
  .pomodoro-container {
    text-align: center;
    padding: 16px;
  }

  .pomodoro-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .pomodoro-timer {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 0 auto 20px;
  }

  .pomodoro-timer svg {
    transform: rotate(-90deg);
  }

  .pomodoro-progress-bg {
    fill: none;
    stroke: var(--border);
    stroke-width: 8;
  }

  .pomodoro-progress-fill {
    fill: none;
    stroke: var(--accent);
    stroke-width: 8;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.5s ease;
  }

  .pomodoro-progress-fill.completed {
    stroke: #10a37f;
  }

  .pomodoro-progress-fill.paused {
    stroke: #f59e0b;
  }

  .pomodoro-time {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .pomodoro-time-display {
    font-size: 36px;
    font-weight: 700;
    font-family: 'SF Mono', Monaco, 'Courier New', monospace;
    color: var(--text-primary);
  }

  .pomodoro-time-label {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 4px;
  }

  .pomodoro-controls {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-bottom: 16px;
  }

  .pomodoro-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .pomodoro-btn.primary {
    background: var(--accent);
    color: white;
  }

  .pomodoro-btn.primary:hover {
    background: var(--accent-hover);
  }

  .pomodoro-btn.secondary {
    background: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border);
  }

  .pomodoro-btn.secondary:hover {
    background: var(--border);
  }

  .pomodoro-btn.warning {
    background: #f59e0b;
    color: white;
  }

  .pomodoro-btn.warning:hover {
    background: #d97706;
  }

  .pomodoro-info {
    font-size: 12px;
    color: var(--text-secondary);
  }

  .pomodoro-completed {
    text-align: center;
    padding: 20px;
  }

  .pomodoro-completed-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .pomodoro-completed-message {
    font-size: 18px;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 8px;
  }

  .pomodoro-completed-sub {
    font-size: 14px;
    color: var(--text-secondary);
  }
`;
// Get the type of content from structuredContent
function getContentType(data) {
    if (!data)
        return "unknown";
    return data.type || "unknown";
}
// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
// Format currency
function formatCurrency(value) {
    if (value >= 1000000) {
        return "$" + (value / 1000000).toFixed(1) + "M";
    }
    else if (value >= 1000) {
        return "$" + (value / 1000).toFixed(0) + "K";
    }
    return "$" + value;
}
// Get icon for content type
function getIcon(type) {
    const icons = {
        greeting: "👋",
        fact: "💡",
        calculation: "🔢",
        time: "🕐",
        dashboard: "📊",
        region_detail: "🗺️",
        top_products: "🏆",
        pomodoro: "🍅",
        unknown: "🚀",
    };
    return icons[type] || icons.unknown;
}
// Get title for content type
function getTitle(type) {
    const titles = {
        greeting: "Greeting",
        fact: "Fun Fact",
        calculation: "Calculator",
        time: "Current Time",
        dashboard: "Sales Dashboard",
        region_detail: "Regional Sales",
        top_products: "Top Products",
        pomodoro: "Pomodoro Timer",
        unknown: "Hello World",
    };
    return titles[type] || titles.unknown;
}
// Render greeting content
function renderGreeting(data) {
    const name = data.name || "World";
    const timestamp = data.timestamp;
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
function renderFact(data) {
    const fact = data.fact || "No fact available";
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
function renderCalculation(data) {
    const expression = data.expression || "0 + 0 = 0";
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
function renderTime(data) {
    const formatted = data.formatted || new Date().toLocaleString();
    const timezone = data.timezone || "UTC";
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
function renderNoData() {
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
function renderDashboard(data) {
    const regions = data.regions || [];
    const totalSales = data.totalSales || 0;
    const period = data.period || "ytd";
    const maxSales = Math.max(...regions.map((r) => r.sales));
    const topRegion = regions.reduce((max, r) => (r.sales > max.sales ? r : max), regions[0]);
    const periodLabels = { q1: "Q1", q2: "Q2", q3: "Q3", q4: "Q4", ytd: "YTD" };
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
        .map(([key, label]) => `
    <button class="period-btn ${period === key ? "active" : ""}" onclick="changePeriod('${key}')">${label}</button>
  `)
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
function renderRegionDetail(data) {
    const region = data.region || {};
    const monthlyData = data.monthlyData || [];
    const totalSales = data.totalSales || 0;
    const qoqGrowth = data.qoqGrowth || 0;
    const bestMonth = data.bestMonth || {};
    const worstMonth = data.worstMonth || {};
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
function renderTopProducts(data) {
    const products = data.products || [];
    const sortBy = data.sortBy || "sales";
    const totalRevenue = data.totalRevenue || 0;
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
// Global pomodoro state
let pomodoroState = null;
let pomodoroIntervalId = null;
// Format time as MM:SS
function formatPomodoroTime(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
// Save pomodoro state to widgetState
function savePomodoroState() {
    if (pomodoroState && window.openai?.setWidgetState) {
        window.openai.setWidgetState(pomodoroState);
    }
}
// Get remaining time in ms
function getPomodoroRemaining() {
    if (!pomodoroState)
        return 0;
    if (pomodoroState.completed)
        return 0;
    if (pomodoroState.isPaused)
        return pomodoroState.pausedRemaining;
    return Math.max(0, pomodoroState.endTime - Date.now());
}
// Render the circular progress ring
function renderPomodoroRing(remaining, total, isPaused, completed) {
    const progress = total > 0 ? remaining / total : 0;
    const circumference = 2 * Math.PI * 45; // r=45
    const offset = circumference * (1 - progress);
    let fillClass = "pomodoro-progress-fill";
    if (completed)
        fillClass += " completed";
    else if (isPaused)
        fillClass += " paused";
    return `
    <svg width="200" height="200" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" class="pomodoro-progress-bg"/>
      <circle cx="50" cy="50" r="45" class="${fillClass}"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${offset}"/>
    </svg>
  `;
}
// Render Pomodoro timer content
function renderPomodoro(data) {
    // Initialize state from toolOutput or widgetState
    // Note: widgetState is a property, not a method
    const savedState = window.openai?.widgetState;
    if (!pomodoroState) {
        if (savedState && savedState.endTime && !savedState.completed) {
            // Restore from saved state
            pomodoroState = savedState;
        }
        else {
            // Initialize from tool output
            pomodoroState = {
                endTime: data.endTime,
                durationMs: data.durationMs,
                isPaused: false,
                pausedRemaining: 0,
                label: data.label || "Focus Session",
                completed: false,
                startedAt: data.startedAt || new Date().toISOString(),
            };
        }
    }
    // Start the timer interval if not already running
    if (!pomodoroIntervalId && !pomodoroState.completed) {
        startPomodoroInterval();
    }
    const remaining = getPomodoroRemaining();
    const total = pomodoroState.durationMs;
    const timeDisplay = formatPomodoroTime(remaining);
    const startTime = new Date(pomodoroState.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    // If completed, show completion UI
    if (pomodoroState.completed) {
        return `
      <div class="pomodoro-completed">
        <div class="pomodoro-completed-icon">🎉</div>
        <div class="pomodoro-completed-message">Time's Up!</div>
        <div class="pomodoro-completed-sub">${pomodoroState.label} complete</div>
      </div>
      <div class="pomodoro-controls">
        <button class="pomodoro-btn primary" onclick="resetPomodoro()">Start New Timer</button>
      </div>
      <div class="pomodoro-info">
        Started at ${startTime}
      </div>
    `;
    }
    const pauseResumeBtn = pomodoroState.isPaused
        ? `<button class="pomodoro-btn primary" onclick="resumePomodoro()">Resume</button>`
        : `<button class="pomodoro-btn warning" onclick="pausePomodoro()">Pause</button>`;
    return `
    <div class="pomodoro-container">
      <div class="pomodoro-label">${escapeHtml(pomodoroState.label)}</div>
      <div class="pomodoro-timer">
        ${renderPomodoroRing(remaining, total, pomodoroState.isPaused, pomodoroState.completed)}
        <div class="pomodoro-time">
          <div class="pomodoro-time-display">${timeDisplay}</div>
          <div class="pomodoro-time-label">${pomodoroState.isPaused ? "paused" : "remaining"}</div>
        </div>
      </div>
      <div class="pomodoro-controls">
        ${pauseResumeBtn}
        <button class="pomodoro-btn secondary" onclick="addPomodoroTime(5)">+5 min</button>
        <button class="pomodoro-btn secondary" onclick="resetPomodoro()">Reset</button>
      </div>
      <div class="pomodoro-info">
        Started at ${startTime}
      </div>
    </div>
  `;
}
// Start the pomodoro countdown interval
function startPomodoroInterval() {
    if (pomodoroIntervalId)
        return;
    pomodoroIntervalId = window.setInterval(() => {
        if (!pomodoroState || pomodoroState.isPaused || pomodoroState.completed)
            return;
        const remaining = pomodoroState.endTime - Date.now();
        if (remaining <= 0) {
            // Timer complete!
            pomodoroState.completed = true;
            savePomodoroState();
            stopPomodoroInterval();
            // Notify ChatGPT
            if (window.openai?.sendFollowUpMessage) {
                window.openai.sendFollowUpMessage({
                    prompt: `My ${pomodoroState.label} timer just finished! What should I do for my break?`,
                });
            }
            else if (window.openai?.sendFollowUp) {
                window.openai.sendFollowUp(`My ${pomodoroState.label} timer just finished!`);
            }
            render();
        }
        else {
            // Just re-render to update display
            render();
        }
    }, 1000);
}
// Stop the pomodoro interval
function stopPomodoroInterval() {
    if (pomodoroIntervalId) {
        clearInterval(pomodoroIntervalId);
        pomodoroIntervalId = null;
    }
}
// Request PiP mode for pomodoro
async function requestPomodoroPiP() {
    try {
        if (window.openai?.requestDisplayMode) {
            await window.openai.requestDisplayMode({ mode: "pip" });
        }
    }
    catch (e) {
        console.log("PiP not available, using default mode");
    }
}
// Tool call helpers (exposed globally for button onclick handlers)
window.sayHello = async () => {
    if (window.openai?.callTool) {
        await window.openai.callTool("say_hello", { name: "Friend" });
    }
    else if (window.openai?.sendFollowUp) {
        window.openai.sendFollowUp("Say hello to me!");
    }
};
window.sayHelloAgain = async () => {
    if (window.openai?.callTool) {
        const names = ["Friend", "World", "Developer", "Human", "ChatGPT User"];
        const randomName = names[Math.floor(Math.random() * names.length)];
        await window.openai.callTool("say_hello", { name: randomName });
    }
    else if (window.openai?.sendFollowUp) {
        window.openai.sendFollowUp("Say hello again with a different name!");
    }
};
window.getRandomFact = async () => {
    if (window.openai?.callTool) {
        await window.openai.callTool("get_random_fact", {});
    }
    else if (window.openai?.sendFollowUp) {
        window.openai.sendFollowUp("Tell me a random fun fact!");
    }
};
window.getTime = async () => {
    if (window.openai?.callTool) {
        await window.openai.callTool("get_time", {});
    }
    else if (window.openai?.sendFollowUp) {
        window.openai.sendFollowUp("What time is it?");
    }
};
// Dashboard tool helpers
window.getSalesDashboard = async (period) => {
    if (window.openai?.callTool) {
        await window.openai.callTool("get_sales_dashboard", period ? { period } : {});
    }
    else if (window.openai?.sendFollowUp) {
        window.openai.sendFollowUp("Show me the sales dashboard");
    }
};
window.changePeriod = async (period) => {
    if (window.openai?.setWidgetState) {
        window.openai.setWidgetState({ selectedPeriod: period });
    }
    const getSalesDashboard = window.getSalesDashboard;
    await getSalesDashboard(period);
};
window.drillDownRegion = async (regionId) => {
    if (window.openai?.callTool) {
        await window.openai.callTool("get_sales_by_region", { region: regionId });
    }
    else if (window.openai?.sendFollowUp) {
        const regionNames = { na: "North America", eu: "Europe", apac: "Asia Pacific", latam: "Latin America" };
        window.openai.sendFollowUp(`Show me sales details for ${regionNames[regionId] || regionId}`);
    }
};
window.getTopProducts = async (sortBy) => {
    if (window.openai?.callTool) {
        await window.openai.callTool("get_top_products", sortBy ? { sortBy } : {});
    }
    else if (window.openai?.sendFollowUp) {
        window.openai.sendFollowUp("Show me the top selling products");
    }
};
window.askAI = async (question) => {
    if (window.openai?.sendFollowUp) {
        window.openai.sendFollowUp(question);
    }
    else if (window.openai?.sendFollowUpMessage) {
        window.openai.sendFollowUpMessage({ prompt: question });
    }
};
// Pomodoro control helpers
window.pausePomodoro = () => {
    if (pomodoroState && !pomodoroState.isPaused && !pomodoroState.completed) {
        pomodoroState.isPaused = true;
        pomodoroState.pausedRemaining = pomodoroState.endTime - Date.now();
        savePomodoroState();
        render();
    }
};
window.resumePomodoro = () => {
    if (pomodoroState && pomodoroState.isPaused && !pomodoroState.completed) {
        pomodoroState.isPaused = false;
        pomodoroState.endTime = Date.now() + pomodoroState.pausedRemaining;
        pomodoroState.pausedRemaining = 0;
        savePomodoroState();
        startPomodoroInterval();
        render();
    }
};
window.resetPomodoro = () => {
    stopPomodoroInterval();
    pomodoroState = null;
    // Ask ChatGPT to start a new timer
    if (window.openai?.sendFollowUpMessage) {
        window.openai.sendFollowUpMessage({
            prompt: "I'd like to start a new pomodoro timer. How long should this session be?",
        });
    }
    else if (window.openai?.sendFollowUp) {
        window.openai.sendFollowUp("Start a new pomodoro timer");
    }
};
window.addPomodoroTime = (minutes) => {
    if (pomodoroState && !pomodoroState.completed) {
        const addMs = minutes * 60 * 1000;
        pomodoroState.durationMs += addMs;
        if (pomodoroState.isPaused) {
            pomodoroState.pausedRemaining += addMs;
        }
        else {
            pomodoroState.endTime += addMs;
        }
        savePomodoroState();
        render();
    }
};
// Main render function
function render() {
    const root = document.getElementById("root");
    if (!root)
        return;
    const openai = window.openai;
    const theme = openai?.theme || "light";
    // toolOutput IS the structuredContent directly (not toolOutput.structuredContent)
    const structuredContent = openai?.toolOutput;
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
            case "pomodoro":
                contentHtml = renderPomodoro(structuredContent);
                // Note: Timer works inline by default. PiP mode can be requested
                // but is not required - inline mode persists in the conversation.
                break;
            default:
                contentHtml = renderNoData();
        }
    }
    else {
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
function init() {
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
}
else {
    init();
}
export {};
