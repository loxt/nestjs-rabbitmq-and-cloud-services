import { ChallengeStatus } from '../interfaces/challenge.interface';
import { IsDate, IsIn, IsNotEmpty } from 'class-validator';

const challengeStatus = Object.values(ChallengeStatus);
export class UpdateChallengeDto {
  @IsNotEmpty()
  @IsIn(challengeStatus)
  status: ChallengeStatus;

  @IsDate()
  @IsNotEmpty()
  challengeDate: Date;
}
