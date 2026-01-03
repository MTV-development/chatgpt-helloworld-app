interface OpenAIWidgetAPI {
    toolInput?: Record<string, unknown>;
    toolOutput?: Record<string, unknown>;
    theme?: "light" | "dark";
    locale?: string;
    displayMode?: string;
    maxHeight?: number;
    callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
    setWidgetState: (state: Record<string, unknown>) => void;
    widgetState?: Record<string, unknown>;
    sendFollowUp: (message: string) => void;
    sendFollowUpMessage?: (opts: {
        prompt: string;
    }) => void;
    requestDisplayMode?: (opts: {
        mode: string;
    }) => Promise<void>;
    requestFullscreen: () => void;
    exitFullscreen: () => void;
}
declare global {
    interface Window {
        openai?: OpenAIWidgetAPI;
    }
}
export {};
