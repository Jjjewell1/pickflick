export interface Participant {
  id: string;
  name: string;
  emoji: string;
  ageTier: "kid" | "tenant" | "adult";
}

export type MovieNightStep =
  | "home"
  | "participants"
  | "genre"
  | "nominate"
  | "vote"
  | "reveal"
  | "history";

export interface NominationEntry {
  movieId: string;
  title: string;
  poster: string | null;
  profileId: string;
  profileName: string;
  profileEmoji: string;
}

export interface VoteEntry {
  profileId: string;
  nominationId: string;
}

export interface MovieNightState {
  id: string;
  step: MovieNightStep;
  participants: string[];
  genre: string;
  maxRating: string;
  nominations: NominationEntry[];
  votes: VoteEntry[];
  winnerId: string | null;
  rerollUsed: boolean;
}

export interface HistoryEntry {
  id: string;
  date: string;
  genre: string;
  winnerTitle: string | null;
  winnerPoster: string | null;
  maxRating: string;
}

export interface JellyfinMovie {
  Id: string;
  Name: string;
  OfficialRating?: string;
  Genres?: string[];
  Overview?: string;
  PremiereDate?: string;
  CommunityRating?: number;
  UserData?: {
    Played?: boolean;
    PlayedPercentage?: number;
  };
}
