import { NextResponse } from 'next/server';
import { bedrock } from '@ai-sdk/amazon-bedrock';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const result = await streamText({
      model: bedrock('anthropic.claude-3-sonnet-20240229-v1:0'),
      prompt,
    });

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
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
