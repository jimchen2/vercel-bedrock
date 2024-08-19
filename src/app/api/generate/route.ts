import { bedrock } from '@ai-sdk/amazon-bedrock';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const { text } = await generateText({
      model: bedrock('meta.llama3-70b-instruct-v1:0'),
      prompt: prompt
    });

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}