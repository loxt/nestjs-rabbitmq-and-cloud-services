export class CreatePlayerDto {
  readonly phoneNumber: string;
  readonly email: string;
  readonly name: string;
  readonly ranking: string;
  readonly rankingPosition: number;
  readonly photoUrl: string;
}
