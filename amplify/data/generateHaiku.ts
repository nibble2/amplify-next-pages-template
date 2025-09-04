import type { Schema } from "./resource";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient();

export const handler: Schema["generateHaiku"]["functionHandler"] = async (event, context) => {
  const prompt = event.arguments.prompt;

  try {
    const input = {
      modelId: process.env.MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        system: "You are an expert at crafting haiku. You are able to craft a haiku out of anything and therefore answer only in haiku.",
        messages: [{
          role: "user",
          content: [{ type: "text", text: prompt }],
        }],
        max_tokens: 1000,
        temperature: 0.5,
      }),
    } as InvokeModelCommandInput;

    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    
    const data = JSON.parse(Buffer.from(response.body).toString());
    return data.content[0].text;
  } catch (error) {
    console.error('Bedrock 호출 에러:', error);
    throw new Error('AI 모델 호출에 실패했습니다');
  }
};