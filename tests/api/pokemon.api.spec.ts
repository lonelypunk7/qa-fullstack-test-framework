import { expect, test } from "@playwright/test";

type PokemonAbility = {
  ability: {
    name: string;
    url: string;
  };
};

type PokemonResponse = {
  id: number;
  name: string;
  is_default: boolean;
  base_experience: number;
  order: number;
  height: number;
  weight: number;
  abilities: PokemonAbility[];
  types: Array<{
    type: {
      name: string;
      url: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
  }>;
  moves: Array<{
    move: {
      name: string;
      url: string;
    };
  }>;
  sprites: {
    front_default: string | null;
  };
};

test.describe("API: PokemonAPI", () => {
  test("pikachu endpoint возвращает валидный непустой payload", async ({
    request,
  }) => {
    const response = await request.get(
      "https://pokeapi.co/api/v2/pokemon/pikachu",
    );

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("application/json");

    const body = (await response.json()) as PokemonResponse;

    expect(body).toBeTruthy();
    expect(body.id).toBeGreaterThan(0);
    expect(body.name).toBe("pikachu");
    expect(body.is_default).toBeTruthy();
    expect(body.base_experience).toBeGreaterThan(0);
    expect(body.order).toBeGreaterThan(0);
    expect(body.height).toBeGreaterThan(0);
    expect(body.weight).toBeGreaterThan(0);
    expect(body.abilities.length).toBeGreaterThan(0);
    expect(body.abilities[0].ability.name).toBeTruthy();
    expect(body.abilities[0].ability.url).toContain("/ability/");
    expect(body.types.length).toBeGreaterThan(0);
    expect(body.types.some((entry) => entry.type.name === "electric")).toBeTruthy();
    expect(body.stats.length).toBeGreaterThan(0);
    expect(body.moves.length).toBeGreaterThan(0);
    expect(body.sprites.front_default).toBeTruthy();
  });

  test("Несуществующий pokemon возвращает 404", async ({ request }) => {
    const response = await request.get(
      "https://pokeapi.co/api/v2/pokemon/pikachu-not-exists-qa",
    );

    expect(response.status()).toBe(404);
    expect(response.ok()).toBeFalsy();
  });

  test("Pokemon с невалидным id=0 возвращает 404", async ({ request }) => {
    const response = await request.get("https://pokeapi.co/api/v2/pokemon/0");

    expect(response.status()).toBe(404);
    expect(response.ok()).toBeFalsy();
  });

  test("Pokemon с несуществующим большим id возвращает 404", async ({
    request,
  }) => {
    const response = await request.get("https://pokeapi.co/api/v2/pokemon/999999");

    expect(response.status()).toBe(404);
    expect(response.ok()).toBeFalsy();
  });

  test("Невалидный pokemon path parameter (пробел) возвращает 400", async ({
    request,
  }) => {
    const response = await request.get("https://pokeapi.co/api/v2/pokemon/%20");

    expect(response.status()).toBe(400);
    expect(response.ok()).toBeFalsy();
  });
});
