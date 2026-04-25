import { expect, test } from "@playwright/test";
import { getJson } from "../../utils/api-client";

type SwapiPerson = {
  name: string;
  height: string;
  films: string[];
};

test.describe("API: SWAPI", () => {
  test("Luke Skywalker is returned by id", async ({ request }) => {
    const person = await getJson<SwapiPerson>(
      request,
      "https://swapi.py4e.com/api/people/1/"
    );

    expect(person.name).toBe("Luke Skywalker");
    expect(Number(person.height)).toBeGreaterThan(100);
    expect(person.films.length).toBeGreaterThan(0);
  });

  test("non-existent entity returns 404", async ({ request }) => {
    const response = await request.get("https://swapi.py4e.com/api/people/9999/");
    expect(response.status()).toBe(404);
  });
});
