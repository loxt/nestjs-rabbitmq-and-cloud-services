import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeModel } from './models/challenge.model';
import { PlayersModule } from '../players/players.module';

@Module({
  imports: [
    PlayersModule,
    MongooseModule.forFeature([
      {
        name: 'Challenge',
        schema: ChallengeModel,
      },
    ]),
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule {}
