import { type ClientSchema, a, defineData, defineFunction } from "@aws-amplify/backend";

export const MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0";

export const generateHaikuFunction = defineFunction({
  entry: "./generateHaiku.ts",
  environment: {
    MODEL_ID,
  },
});

const schema = a.schema({
  // 기존 Todo 모델
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  
  // 새로 추가: generateHaiku 쿼리
  generateHaiku: a
    .query()
    .arguments({ prompt: a.string().required() })
    .returns(a.string())
    .authorization((allow) => [allow.publicApiKey()])
    .handler(a.handler.function(generateHaikuFunction)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});