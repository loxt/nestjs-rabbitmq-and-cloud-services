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
  REALIZED = 'realized',
  ACCEPTED = 'accepted',
  REFUSED = 'refused',
  CANCELED = 'canceled',
}

export interface Match extends Document {
  category: string;
  players: Player[];
  winner: Player;
  result: MatchResult[];
}

export interface MatchResult {
  set: string;
}
