import OpenAI from "openai";

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    const baseUrl = process.env.OLLAMA_URL || "http://192.168.1.154:11434";
    _client = new OpenAI({
      apiKey: "ollama",
      baseURL: `${baseUrl}/v1`,
    });
  }
  return _client;
}

export function isAIConfigured(): boolean {
  return true;
}

export function getOpenAI(): OpenAI {
  return getClient();
}
