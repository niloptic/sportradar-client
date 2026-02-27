export interface SportradarClientOptions {
  apiKey: string;
  baseUrl?: string;
  accessLevel?: "trial" | "production" | string;
  language?: string;
}

export type QueryValue = string | number | boolean;
export type QueryParams = Record<string, QueryValue>;

function readEnv(name: string): string | undefined {
  const processObject = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return processObject?.env?.[name];
}

export type NcaambSeasonTypeCode = "REG" | "CT" | "PST" | string;

export type NcaambGameStatus =
  | "scheduled"
  | "created"
  | "inprogress"
  | "halftime"
  | "complete"
  | "closed"
  | "cancelled"
  | "postponed"
  | "delayed"
  | "unnecessary"
  | "time-tbd"
  | "if-necessary"
  | "forfeit";

export interface NcaambOrganization {
  id?: string;
  reference?: string;
  name?: string;
  alias?: string;
  sr_id?: string;
  [key: string]: unknown;
}

export interface NcaambVenue {
  id: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  zip?: string;
  capacity?: number;
  sr_id?: string;
  [key: string]: unknown;
}

export interface NcaambSeason {
  id?: string;
  year?: number;
  type?: string;
  name?: string;
}

export interface NcaambRecord {
  wins: number;
  losses: number;
}

export interface NcaambTeamBase extends NcaambOrganization {
  market?: string;
  points?: number;
  rank?: number;
  bonus?: boolean;
  double_bonus?: boolean;
  remaining_timeouts?: number;
  record?: NcaambRecord;
  [key: string]: unknown;
}

export interface NcaambPlayerBase {
  id?: string;
  reference?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  abbr_name?: string;
  position?: string;
  primary_position?: string;
  jersey_number?: string;
  experience?: string;
  status?: string;
  sr_id?: string;
  [key: string]: unknown;
}

export interface NcaambGameCore {
  id: string;
  status?: NcaambGameStatus | string;
  coverage?: "full" | "extended_boxscore" | "boxscore" | string;
  scheduled?: string;
  title?: string;
  home_team?: string;
  away_team?: string;
  neutral_site?: boolean;
  conference_game?: boolean;
  clock?: string;
  clock_decimal?: string;
  half?: number;
  quarter?: number;
  attendance?: number;
  lead_changes?: number;
  times_tied?: number;
  duration?: string;
  venue?: NcaambVenue;
  time_zones?: {
    home?: string;
    away?: string;
    venue?: string;
  };
  [key: string]: unknown;
}

export interface NcaambScheduleParticipant {
  name?: string;
  record?: number;
  seed?: number;
  team?: NcaambOrganization & { market?: string };
  source?: {
    id: string;
    title?: string;
    round?: number;
    outcome?: "win" | "loss" | string;
  };
}

export interface NcaambScheduleGame extends NcaambGameCore {
  home?: NcaambTeamBase;
  away?: NcaambTeamBase;
  broadcasts?: {
    broadcast?: Array<{
      network?: string;
      channel?: string;
      url?: string;
      locale?: "Home" | "Away" | "National" | "International" | string;
      type?: "Internet" | "Radio" | "TV" | string;
    }>;
  };
}

export interface NcaambDailyScheduleResponse extends NcaambOrganization {
  date?: string;
  games?: {
    game?: NcaambScheduleGame[];
  };
}

export interface NcaambSummaryTeam extends NcaambTeamBase {
  scoring?: {
    quarter?: Array<{ number: number; points?: number; sequence: number }>;
    half?: Array<{ number: number; points?: number; sequence: number }>;
    overtime?: Array<{ number: number; points?: number; sequence: number }>;
  };
  statistics?: Record<string, unknown>;
  players?: {
    player?: Array<Record<string, unknown>>;
  };
}

export interface NcaambGameSummaryResponse extends NcaambGameCore {
  season?: NcaambSeason;
  team?: NcaambSummaryTeam[];
  officials?: {
    official?: Array<Record<string, unknown>>;
  };
}

export interface NcaambPbpStatistic {
  team?: {
    id: string;
    reference?: string;
    market?: string;
    name?: string;
    sr_id?: string;
  };
  player?: {
    id?: string;
    reference?: string;
    full_name?: string;
    jersey_number?: string;
    sr_id?: string;
  };
  [key: string]: unknown;
}

export interface NcaambPbpEvent {
  id: string;
  event_type: string;
  description: string;
  clock?: string;
  clock_decimal?: string;
  wall_clock?: string;
  home_points?: number;
  away_points?: number;
  number?: number;
  sequence?: number;
  updated?: string;
  rescinded?: boolean;
  attribution?: NcaambOrganization & {
    team_basket?: "left" | "right";
  };
  possession?: NcaambOrganization;
  location?: {
    coord_x: number;
    coord_y: number;
    action_area?: string;
  };
  qualifiers?: {
    qualifier?: Array<{ name?: string }>;
  };
  statistics?: Record<string, NcaambPbpStatistic | NcaambPbpStatistic[] | undefined>;
  [key: string]: unknown;
}

export interface NcaambPbpPeriod {
  id: string;
  number: number;
  sequence: number;
  scoring: {
    lead_changes?: number;
    times_tied?: number;
    home?: NcaambTeamBase & { points: number };
    away?: NcaambTeamBase & { points: number };
  };
  events: {
    event?: NcaambPbpEvent[];
  };
}

export type NcaambPlayByPlayResponse = Omit<NcaambGameCore, "half" | "quarter"> & {
  season?: NcaambSeason;
  home?: NcaambTeamBase;
  away?: NcaambTeamBase;
  half?: NcaambPbpPeriod[];
  quarter?: NcaambPbpPeriod[];
  overtime?: NcaambPbpPeriod[];
  deleted_events?: {
    event?: Array<{ id: string }>;
  };
};

export interface NcaambTeamsResponse extends NcaambOrganization {
  teams?: {
    team?: Array<NcaambTeamBase>;
  };
}

export interface NcaambTeamProfileResponse extends NcaambTeamBase {
  venue?: NcaambVenue;
  hierarchy?: {
    league?: NcaambOrganization;
    conference?: NcaambOrganization;
    division?: NcaambOrganization;
  };
  coaches?: {
    coach?: Array<Record<string, unknown>>;
  };
  team_colors?: {
    team_color?: Array<Record<string, unknown>>;
  };
  players?: {
    player?: Array<NcaambPlayerBase & { injuries?: { injury?: Array<Record<string, unknown>> } }>;
  };
}

export interface NcaambPlayerSeasonTeam {
  id?: string;
  name?: string;
  market?: string;
  alias?: string;
  statistics?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface NcaambPlayerProfileSeason {
  id: string;
  year: number;
  type: NcaambSeasonTypeCode;
  team?: NcaambPlayerSeasonTeam[];
}

export interface NcaambPlayerProfileResponse extends NcaambPlayerBase {
  league?: NcaambOrganization;
  team?: NcaambTeamBase;
  draft?: Record<string, unknown>;
  seasons?: {
    season?: NcaambPlayerProfileSeason[];
  };
}

export interface NcaambSeasonListItem {
  id?: string;
  year?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  type?: {
    code?: NcaambSeasonTypeCode;
    name?: string;
  };
  [key: string]: unknown;
}

export interface NcaambSeasonsResponse extends NcaambOrganization {
  season?: NcaambSeasonListItem[];
}

export interface NcaambStandingsTeamRecord extends NcaambTeamBase {
  subdivision?: string;
  records?: {
    record?: Array<{
      record_type?: string;
      wins?: number;
      losses?: number;
      ties?: number;
      pct?: number;
      [key: string]: unknown;
    }>;
  };
  streak?: {
    win?: { current?: number; max?: number };
    loss?: { current?: number; max?: number };
  };
  [key: string]: unknown;
}

export interface NcaambStandingsResponse extends NcaambOrganization {
  season?: {
    id: string;
    year: number;
    type: NcaambSeasonTypeCode;
    conference?: Array<{
      id?: string;
      name?: string;
      alias?: string;
      team?: NcaambStandingsTeamRecord[];
    }>;
  };
}

export interface NcaambSeasonalStatisticsRank {
  rank: number;
  tied?: boolean;
  score: number;
  player: NcaambPlayerBase;
  team?: NcaambTeamBase[];
  statistics?: Record<string, unknown>;
}

export interface NcaambSeasonalStatisticsTeam extends NcaambTeamBase {
  splits?: Record<string, unknown>;
  team_records?: {
    overall?: Record<string, unknown>;
    opponents?: Record<string, unknown>;
  };
  player_records?: {
    player?: Array<NcaambPlayerBase & { overall?: Record<string, unknown>; splits?: Record<string, unknown> }>;
  };
}

export interface NcaambSeasonalStatisticsResponse {
  id: string;
  year: number;
  type: NcaambSeasonTypeCode;
  team?: NcaambSeasonalStatisticsTeam;
  leaders?: {
    type?: "league" | "division" | "conference" | string;
    category?: Array<{
      name: string;
      type: "total" | "average" | string;
      rank?: NcaambSeasonalStatisticsRank[];
    }>;
  };
  [key: string]: unknown;
}

export interface NcaambPollTeamRanking extends NcaambTeamBase {
  rank?: number;
  prev_rank?: number;
  wins?: number;
  losses?: number;
  points?: number;
  fp_votes?: number;
  votes?: number;
}

export interface NcaambRankingsResponse extends NcaambOrganization {
  effective_time?: string;
  week?: string;
  year?: number;
  rankings?: {
    team?: NcaambPollTeamRanking[];
  };
  candidates?: {
    team?: NcaambPollTeamRanking[];
  };
}

export interface NcaambRpiOpponentCompare {
  rank: string;
  wins: number;
  losses: number;
}

export interface NcaambRpiTeamRanking extends NcaambTeamBase {
  rank: number;
  prev_rank?: number;
  wins: number;
  losses: number;
  rpi: number;
  sos: number;
  opponent?: NcaambRpiOpponentCompare[];
  [key: string]: unknown;
}

export interface NcaambRpiRankingsResponse {
  id: string;
  year: number;
  type: NcaambSeasonTypeCode;
  rankings?: {
    team?: NcaambRpiTeamRanking[];
  };
}

export interface NcaambNetRankingsTeam {
  id?: string;
  market?: string;
  name?: string;
  wins?: number;
  losses?: number;
  net_rank?: number;
  prev_net_rank?: number;
  [key: string]: unknown;
}

export interface NcaambNetRankingsResponse {
  id?: string;
  year?: string;
  type?: string;
  rankings?: {
    team?: NcaambNetRankingsTeam[];
  };
}

export interface NcaambTransferPortalPlayer extends NcaambPlayerBase {
  height?: number;
  weight?: number;
  birth_place?: string;
  updated?: string;
}

export interface NcaambTransferPortalResponse {
  league?: NcaambOrganization & {
    transfer_portal_players?: NcaambTransferPortalPlayer[];
  };
  [key: string]: unknown;
}

export class SportradarClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly accessLevel: string;
  private readonly language: string;

  constructor({
    apiKey,
    baseUrl = "https://api.sportradar.com",
    accessLevel,
    language = "en"
  }: SportradarClientOptions) {
    if (!apiKey) {
      throw new Error("apiKey is required");
    }

    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.accessLevel = accessLevel ?? readEnv("SPORTRADAR_ACCESS_LEVEL") ?? "trial";
    this.language = language;
  }

  async get<T = unknown>(path: string, query: QueryParams = {}): Promise<T | string> {
    const params = new URLSearchParams({
      ...Object.fromEntries(Object.entries(query).map(([k, v]) => [k, String(v)])),
      api_key: this.apiKey
    });

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = `${this.baseUrl}${normalizedPath}?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Sportradar request failed (${response.status}): ${body}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    }
    return response.text();
  }

  async getNcaambDailySchedule(date: `${number}-${number}-${number}`): Promise<NcaambDailyScheduleResponse> {
    return this.getJson<NcaambDailyScheduleResponse>(
      this.buildNcaambPath(`v5/${this.language}/games/${date}/schedule.json`)
    );
  }

  async getNcaambGameSummary(gameId: string): Promise<NcaambGameSummaryResponse> {
    return this.getJson<NcaambGameSummaryResponse>(
      this.buildNcaambPath(`v8/${this.language}/games/${gameId}/summary.json`)
    );
  }

  async getNcaambPlayByPlay(gameId: string): Promise<NcaambPlayByPlayResponse> {
    return this.getJson<NcaambPlayByPlayResponse>(
      this.buildNcaambPath(`v8/${this.language}/games/${gameId}/pbp.json`)
    );
  }

  async getNcaambTeams(): Promise<NcaambTeamsResponse> {
    return this.getJson<NcaambTeamsResponse>(
      this.buildNcaambPath(`v7/${this.language}/league/teams.json`)
    );
  }

  async getNcaambTeamProfile(teamId: string): Promise<NcaambTeamProfileResponse> {
    return this.getJson<NcaambTeamProfileResponse>(
      this.buildNcaambPath(`v8/${this.language}/teams/${teamId}/profile.json`)
    );
  }

  async getNcaambPlayerProfile(playerId: string): Promise<NcaambPlayerProfileResponse> {
    return this.getJson<NcaambPlayerProfileResponse>(
      this.buildNcaambPath(`v8/${this.language}/players/${playerId}/profile.json`)
    );
  }

  async getNcaambSeasons(): Promise<NcaambSeasonsResponse> {
    return this.getJson<NcaambSeasonsResponse>(
      this.buildNcaambPath(`v8/${this.language}/league/seasons.json`)
    );
  }

  async getNcaambStandings(
    seasonYear: number,
    seasonType: NcaambSeasonTypeCode
  ): Promise<NcaambStandingsResponse> {
    return this.getJson<NcaambStandingsResponse>(
      this.buildNcaambPath(`v3/${this.language}/seasons/${seasonYear}/${seasonType}/standings.json`)
    );
  }

  async getNcaambSeasonalStatistics(
    seasonYear: number,
    seasonType: NcaambSeasonTypeCode,
    teamId: string
  ): Promise<NcaambSeasonalStatisticsResponse> {
    return this.getJson<NcaambSeasonalStatisticsResponse>(
      this.buildNcaambPath(`v8/${this.language}/seasons/${seasonYear}/${seasonType}/teams/${teamId}/statistics.json`)
    );
  }

  async getNcaambRankingsCurrentWeek(
    pollType: "AP" | "US" | string,
    seasonYear: number
  ): Promise<NcaambRankingsResponse> {
    return this.getJson<NcaambRankingsResponse>(
      this.buildNcaambPath(`v8/${this.language}/polls/${pollType}/${seasonYear}/rankings.json`)
    );
  }

  async getNcaambRankingsByWeek(
    pollType: "AP" | "US" | string,
    seasonYear: number,
    ncaaWeek: string
  ): Promise<NcaambRankingsResponse> {
    return this.getJson<NcaambRankingsResponse>(
      this.buildNcaambPath(`v8/${this.language}/polls/${pollType}/${seasonYear}/${ncaaWeek}/rankings.json`)
    );
  }

  async getNcaambRpiRankings(seasonYear: number): Promise<NcaambRpiRankingsResponse> {
    return this.getJson<NcaambRpiRankingsResponse>(
      this.buildNcaambPath(`v4/${this.language}/rpi/${seasonYear}/rankings.json`)
    );
  }

  async getNcaambNetRankings(
    seasonYear: number,
    seasonType: NcaambSeasonTypeCode
  ): Promise<NcaambNetRankingsResponse> {
    return this.getJson<NcaambNetRankingsResponse>(
      this.buildNcaambPath(`v8/${this.language}/seasons/${seasonYear}/${seasonType}/netrankings.json`)
    );
  }

  async getNcaambTransferPortal(): Promise<NcaambTransferPortalResponse> {
    return this.getJson<NcaambTransferPortalResponse>(
      this.buildNcaambPath(`v8/${this.language}/league/transfer_portal.json`)
    );
  }

  private buildNcaambPath(rest: string): string {
    return `/ncaamb/${this.accessLevel}/${rest}`;
  }

  private async getJson<T>(path: string): Promise<T> {
    const response = await this.get<T>(path);
    if (typeof response === "string") {
      throw new Error(`Expected JSON response from ${path} but got text`);
    }
    return response;
  }
}
