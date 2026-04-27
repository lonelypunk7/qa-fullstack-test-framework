import { expect, test } from "@playwright/test";

type PokemonShortResponse = {
  id: number;
  name: string;
};

test.describe("API: PokemonAPI (GET /pokemon/{name}) query robustness", () => {
  test("лишние query-параметры не ломают запрос", async ({ request }) => {
    const response = await request.get(
      "https://pokeapi.co/api/v2/pokemon/pikachu?foo=bar&debug=true&limit=-1",
    );

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const body = (await response.json()) as PokemonShortResponse;
    expect(body.id).toBeGreaterThan(0);
    expect(body.name).toBe("pikachu");
  });

  test("дублирующиеся и нестандартные query-параметры не ломают запрос", async ({
    request,
  }) => {
    const response = await request.get(
      "https://pokeapi.co/api/v2/pokemon/pikachu?sort=asc&sort=desc&name[]=x&empty=&space=%20",
    );

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const body = (await response.json()) as PokemonShortResponse;
    expect(body.name).toBe("pikachu");
  });

  test("очень длинный query-параметр не ломает запрос", async ({ request }) => {
    const longValue = "x".repeat(512);
    const response = await request.get(
      `https://pokeapi.co/api/v2/pokemon/pikachu?trace=${longValue}`,
    );

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const body = (await response.json()) as PokemonShortResponse;
    expect(body.name).toBe("pikachu");
  });
});
