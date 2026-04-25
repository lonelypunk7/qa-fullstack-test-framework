import { APIRequestContext, expect } from "@playwright/test";

export async function getJson<T>(
  request: APIRequestContext,
  url: string
): Promise<T> {
  const response = await request.get(url);
  expect(response.ok()).toBeTruthy();
  return (await response.json()) as T;
}
