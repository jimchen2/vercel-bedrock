import { NextResponse } from "next/server";
import { bedrock } from "@ai-sdk/amazon-bedrock";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

const API_KEY = process.env.API_KEY;

export async function POST(request: Request) {
  try {
    // Check for API key in the request headers
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, model = "bedrock", modelName = "anthropic.claude-3-haiku-20240307-v1:0", system, maxTokens, temperature, topP, topK, presencePenalty, frequencyPenalty } = await request.json();

    let selectedModel;

    if (model === "bedrock") {
      selectedModel = bedrock(modelName);
    } else if (model === "google") {
      selectedModel = google(modelName);
    } else if (model === "openai") {
      selectedModel = openai(modelName);
    } else {
      throw new Error("Unsupported model provider");
    }

    const streamOptions: any = {
      model: selectedModel,
      messages,
    };

    if (system) streamOptions.system = system;
    if (maxTokens) streamOptions.maxTokens = maxTokens;
    if (temperature !== undefined) streamOptions.temperature = temperature;
    if (topP !== undefined) streamOptions.topP = topP;
    if (topK !== undefined) streamOptions.topK = topK;
    if (presencePenalty !== undefined) streamOptions.presencePenalty = presencePenalty;
    if (frequencyPenalty !== undefined) streamOptions.frequencyPenalty = frequencyPenalty;

    console.log(streamOptions)
    const result = await streamText(streamOptions);
    

    const stream = new ReadableStream({
      async start(controller) {
        const reader = result.textStream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
