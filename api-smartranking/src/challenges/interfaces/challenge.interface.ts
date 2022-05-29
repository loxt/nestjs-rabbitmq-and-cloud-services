import { Player } from '../../players/interfaces/player.interface';

export interface Challenge extends Document {
  challengeRequestDate: Date;
  challengeResponseDate: Date;
  category: string;
  requester: Player;
  players: Player[];
  match: Match;
  status: ChallengeStatus;
}

export enum ChallengeStatus {
  PENDING = 'pending',
}

export interface Match extends Document {
  category: string;
  players: Player[];
  result: MatchResult[];
}

export interface MatchResult {
  set: string;
}
