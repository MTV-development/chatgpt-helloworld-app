interface OpenAIWidgetAPI {
    toolInput?: Record<string, unknown>;
    toolOutput?: {
        content?: Array<{
            type: string;
            text?: string;
        }>;
        structuredContent?: Record<string, unknown>;
    };
    theme?: "light" | "dark";
    locale?: string;
    displayMode?: string;
    callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
    setWidgetState: (state: Record<string, unknown>) => void;
    getWidgetState: () => Record<string, unknown>;
    sendFollowUp: (message: string) => void;
    requestFullscreen: () => void;
    exitFullscreen: () => void;
}
declare global {
    interface Window {
        openai?: OpenAIWidgetAPI;
    }
}
export {};
