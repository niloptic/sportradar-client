# @niloptic/sportradar-client

TypeScript-first client for Sportradar NCAA Men's Basketball APIs.

- ESM package
- Built-in TypeScript declarations
- Env-aware access level (`SPORTRADAR_ACCESS_LEVEL`)

## Installation

```bash
npm install @niloptic/sportradar-client
```

## Requirements

- Node.js `>=18` (native `fetch`)

## Quick Start

```ts
import { SportradarClient, type NcaambGameSummaryResponse } from "@niloptic/sportradar-client";

const client = new SportradarClient({
  apiKey: process.env.SPORTRADAR_API_KEY!,
  language: "en"
});

const schedule = await client.getNcaambDailySchedule("2026-02-27");
const gameId = schedule.games?.game?.[0]?.id;

if (gameId) {
  const summary: NcaambGameSummaryResponse = await client.getNcaambGameSummary(gameId);
  const pbp = await client.getNcaambPlayByPlay(gameId);
  console.log(summary.status, pbp.home?.points, pbp.away?.points);
}
```

## Configuration

### Constructor

```ts
new SportradarClient({
  apiKey: string,                  // required
  baseUrl?: string,                // default: "https://api.sportradar.com"
  accessLevel?: "trial" | "production" | string,
  language?: string                // default: "en"
})
```

### Access Level Resolution

Access level is resolved in this order:

1. `accessLevel` option passed to constructor
2. `SPORTRADAR_ACCESS_LEVEL` env var
3. default: `trial`

## Environment Variables

Use local env files for development/testing:

```bash
cp .env.example .env
```

Example `.env`:

```bash
SPORTRADAR_API_KEY=your_real_key_here
SPORTRADAR_ACCESS_LEVEL=trial
SPORTRADAR_BASE_URL=https://api.sportradar.com
```

## API Reference

All NCAA methods are instance methods on `SportradarClient`.

### Core Request Helper

- `get<T = unknown>(path: string, query?: Record<string, string | number | boolean>): Promise<T | string>`

### NCAA Men's Basketball Endpoints

- `getNcaambDailySchedule(date)`
  - Path: `v8/{language}/games/{year}/{month}/{day}/schedule.json`
- `getNcaambGameSummary(gameId)`
  - Path: `v8/{language}/games/{gameId}/summary.json`
- `getNcaambPlayByPlay(gameId)`
  - Path: `v8/{language}/games/{gameId}/pbp.json`
- `getNcaambTeams()`
  - Path: `v7/{language}/league/teams.json`
- `getNcaambLeagueHierarchy()`
  - Path: `v8/{language}/league/hierarchy.json`
- `getNcaambDailyChanges(date)`
  - Path: `v8/{language}/league/{year}/{month}/{day}/changes.json`
- `getNcaambTeamProfile(teamId)`
  - Path: `v8/{language}/teams/{teamId}/profile.json`
- `getNcaambPlayerProfile(playerId)`
  - Path: `v8/{language}/players/{playerId}/profile.json`
- `getNcaambSeasons()`
  - Path: `v8/{language}/league/seasons.json`
- `getNcaambStandings(seasonYear, seasonType)`
  - Path: `v3/{language}/seasons/{year}/{type}/standings.json`
- `getNcaambSeasonalStatistics(seasonYear, seasonType, teamId)`
  - Path: `v8/{language}/seasons/{year}/{type}/teams/{teamId}/statistics.json`
- `getNcaambRankingsCurrentWeek(pollType, seasonYear)`
  - Path: `v8/{language}/polls/{poll}/{year}/rankings.json`
- `getNcaambRankingsByWeek(pollType, seasonYear, ncaaWeek)`
  - Path: `v8/{language}/polls/{poll}/{year}/{week}/rankings.json`
- `getNcaambRpiRankings(seasonYear)`
  - Path: `v4/{language}/rpi/{year}/rankings.json`
- `getNcaambNetRankings(seasonYear, seasonType)`
  - Path: `v8/{language}/seasons/{year}/{type}/netrankings.json`
- `getNcaambTransferPortal()`
  - Path: `v8/{language}/league/transfer_portal.json`

## Exported Types

The package exports response models and shared types, including:

- `NcaambDailyScheduleResponse`
- `NcaambGameSummaryResponse`
- `NcaambPlayByPlayResponse`
- `NcaambTeamsResponse`
- `NcaambLeagueHierarchyResponse`
- `NcaambDailyChangesResponse`
- `NcaambTeamProfileResponse`
- `NcaambPlayerProfileResponse`
- `NcaambSeasonsResponse`
- `NcaambStandingsResponse`
- `NcaambSeasonalStatisticsResponse`
- `NcaambRankingsResponse`
- `NcaambRpiRankingsResponse`
- `NcaambNetRankingsResponse`
- `NcaambTransferPortalResponse`
- `NcaambSeasonTypeCode`

## Error Behavior

- Any non-2xx response throws:
  - `Sportradar request failed (<status>): <response-body>`
- Endpoint helpers expecting JSON throw if a text payload is returned.

## Development

```bash
npm install
npm run build
npm test
npm run test:coverage
npm run test:watch
```

Live smoke test (requires real API key):

```bash
npm run test:live
```

## Publish

```bash
npm login
npm publish --access public
```

Package name:

- `@niloptic/sportradar-client`

## License

MIT
