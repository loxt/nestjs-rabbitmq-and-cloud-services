import { ChallengeStatus } from '../interfaces/challenge.interface';

export class UpdateChallengeDto {
  status: ChallengeStatus;
  challengeDate: Date;
}
