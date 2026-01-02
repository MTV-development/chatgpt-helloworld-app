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
    max-width: 400px;
    margin: 0 auto;
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
`;
// Get the type of content from structuredContent
function getContentType(data) {
    if (!data)
        return "unknown";
    return data.type || "unknown";
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
      <button class="widget-button secondary" onclick="getRandomFact()">Get a Fact</button>
    </div>
  `;
}
// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
// Get icon for content type
function getIcon(type) {
    const icons = {
        greeting: "👋",
        fact: "💡",
        calculation: "🔢",
        time: "🕐",
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
        unknown: "Hello World",
    };
    return titles[type] || titles.unknown;
}
// Main render function
function render() {
    const root = document.getElementById("root");
    if (!root)
        return;
    const openai = window.openai;
    const theme = openai?.theme || "light";
    const structuredContent = openai?.toolOutput?.structuredContent;
    const contentType = getContentType(structuredContent);
    // Set theme
    document.documentElement.setAttribute("data-theme", theme);
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
            default:
                contentHtml = renderNoData();
        }
    }
    else {
        contentHtml = renderNoData();
    }
    root.innerHTML = `
    <div class="widget-container">
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
// Initialize
function init() {
    // Inject styles
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
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
}
// Wait for DOM and initialize
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
}
else {
    init();
}
export {};
