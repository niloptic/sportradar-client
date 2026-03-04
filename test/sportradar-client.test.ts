import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SportradarClient } from "../src/index";

function mockJsonFetch(payload: unknown = { ok: true }) {
  const fetchMock = vi.fn().mockImplementation(async () =>
    new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "content-type": "application/json" }
    })
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("SportradarClient", () => {
  const originalAccessLevel = process.env.SPORTRADAR_ACCESS_LEVEL;

  beforeEach(() => {
    delete process.env.SPORTRADAR_ACCESS_LEVEL;
    vi.restoreAllMocks();
  });

  afterEach(() => {
    if (originalAccessLevel === undefined) {
      delete process.env.SPORTRADAR_ACCESS_LEVEL;
    } else {
      process.env.SPORTRADAR_ACCESS_LEVEL = originalAccessLevel;
    }
  });

  it("throws when apiKey is missing", () => {
    expect(() => new SportradarClient({ apiKey: "" })).toThrow("apiKey is required");
  });

  it("uses SPORTRADAR_ACCESS_LEVEL from env when accessLevel option is omitted", async () => {
    process.env.SPORTRADAR_ACCESS_LEVEL = "trial";
    const fetchMock = mockJsonFetch({ league: {} });

    const client = new SportradarClient({ apiKey: "abc123" });
    await client.getNcaambTeams();

    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("/ncaamb/trial/v7/en/league/teams.json");
  });

  it("prefers explicit accessLevel option over env var", async () => {
    process.env.SPORTRADAR_ACCESS_LEVEL = "trial";
    const fetchMock = mockJsonFetch({ game: {} });

    const client = new SportradarClient({
      apiKey: "abc123",
      accessLevel: "production",
      language: "en"
    });
    await client.getNcaambGameSummary("game-1");

    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("/ncaamb/production/v8/en/games/game-1/summary.json");
  });

  it("defaults access level to trial when env is not set", async () => {
    const fetchMock = mockJsonFetch({ league: {} });

    const client = new SportradarClient({ apiKey: "abc123" });
    await client.getNcaambTeams();

    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("/ncaamb/trial/v7/en/league/teams.json");
  });

  it("builds endpoint URL and serializes query values in get()", async () => {
    const fetchMock = mockJsonFetch({ ok: true });

    const client = new SportradarClient({ apiKey: "key123", baseUrl: "https://api.sportradar.com/" });
    await client.get("/foo/bar.json", { season: 2026, live: false });

    const [url] = fetchMock.mock.calls[0];
    const parsed = new URL(String(url));

    expect(parsed.pathname).toBe("/foo/bar.json");
    expect(parsed.searchParams.get("api_key")).toBe("key123");
    expect(parsed.searchParams.get("season")).toBe("2026");
    expect(parsed.searchParams.get("live")).toBe("false");
  });

  it("returns plain text from get() for non-json content type", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response("ok-text", {
        status: 200,
        headers: { "content-type": "text/plain" }
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = new SportradarClient({ apiKey: "abc123" });
    const response = await client.get("/health");

    expect(response).toBe("ok-text");
  });

  it("throws when endpoint helper expects JSON but receives text", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response("plain-text", {
        status: 200,
        headers: { "content-type": "text/plain" }
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = new SportradarClient({ apiKey: "abc123" });
    await expect(client.getNcaambTeams()).rejects.toThrow("Expected JSON response");
  });

  it("throws a useful error message on non-OK responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response("Not authorized", {
        status: 401,
        headers: { "content-type": "text/plain" }
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = new SportradarClient({ apiKey: "bad-key" });
    await expect(client.getNcaambTeams()).rejects.toThrow(
      "Sportradar request failed (401): Not authorized"
    );
  });

  it("builds all current NCAA endpoint paths correctly", async () => {
    const fetchMock = mockJsonFetch({});
    const client = new SportradarClient({
      apiKey: "abc123",
      accessLevel: "trial",
      language: "en"
    });

    const cases: Array<{
      call: () => Promise<unknown>;
      expectedPath: string;
    }> = [
      {
        call: () => client.getNcaambDailySchedule("2026-02-27"),
        expectedPath: "/ncaamb/trial/v8/en/games/2026/02/27/schedule.json"
      },
      {
        call: () => client.getNcaambGameSummary("game123"),
        expectedPath: "/ncaamb/trial/v8/en/games/game123/summary.json"
      },
      {
        call: () => client.getNcaambPlayByPlay("game123"),
        expectedPath: "/ncaamb/trial/v8/en/games/game123/pbp.json"
      },
      {
        call: () => client.getNcaambTeams(),
        expectedPath: "/ncaamb/trial/v7/en/league/teams.json"
      },
      {
        call: () => client.getNcaambTeamProfile("team123"),
        expectedPath: "/ncaamb/trial/v8/en/teams/team123/profile.json"
      },
      {
        call: () => client.getNcaambPlayerProfile("player123"),
        expectedPath: "/ncaamb/trial/v8/en/players/player123/profile.json"
      },
      {
        call: () => client.getNcaambSeasons(),
        expectedPath: "/ncaamb/trial/v8/en/league/seasons.json"
      },
      {
        call: () => client.getNcaambStandings(2026, "REG"),
        expectedPath: "/ncaamb/trial/v3/en/seasons/2026/REG/standings.json"
      },
      {
        call: () => client.getNcaambSeasonalStatistics(2026, "REG", "team123"),
        expectedPath: "/ncaamb/trial/v8/en/seasons/2026/REG/teams/team123/statistics.json"
      },
      {
        call: () => client.getNcaambRankingsCurrentWeek("AP", 2026),
        expectedPath: "/ncaamb/trial/v8/en/polls/AP/2026/rankings.json"
      },
      {
        call: () => client.getNcaambRankingsByWeek("AP", 2026, "W5"),
        expectedPath: "/ncaamb/trial/v8/en/polls/AP/2026/W5/rankings.json"
      },
      {
        call: () => client.getNcaambRpiRankings(2026),
        expectedPath: "/ncaamb/trial/v4/en/rpi/2026/rankings.json"
      },
      {
        call: () => client.getNcaambNetRankings(2026, "REG"),
        expectedPath: "/ncaamb/trial/v8/en/seasons/2026/REG/netrankings.json"
      },
      {
        call: () => client.getNcaambTransferPortal(),
        expectedPath: "/ncaamb/trial/v8/en/league/transfer_portal.json"
      }
    ];

    for (const testCase of cases) {
      fetchMock.mockClear();
      await testCase.call();
      const [url] = fetchMock.mock.calls[0];
      const parsed = new URL(String(url));
      expect(parsed.pathname).toBe(testCase.expectedPath);
      expect(parsed.searchParams.get("api_key")).toBe("abc123");
    }
  });
});
