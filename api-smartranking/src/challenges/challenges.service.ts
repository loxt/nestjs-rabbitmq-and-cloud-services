import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge, ChallengeStatus } from './interfaces/challenge.interface';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ChallengesService {
  constructor(
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
  ) {}

  async create(createChallengeDto: CreateChallengeDto) {
    // validate if players exists
    for (const player of createChallengeDto.players) {
      const foundedPlayer = await this.playersService.findOne(player._id);
      if (!foundedPlayer) {
        throw new NotFoundException(`Player with id ${player._id} not found`);
      }
    }

    // validate if requester is in a challenge
    const requesterIsInTheChallenge = createChallengeDto.players.some(
      (player) => player._id === createChallengeDto.requester,
    );

    if (!requesterIsInTheChallenge) {
      throw new BadRequestException('Requester must be in the match');
    }

    const requesterCategory = await this.categoriesService.findPlayerCategory(
      createChallengeDto.requester as unknown as string,
    );

    if (!requesterCategory) {
      throw new BadRequestException(
        `Requester with id ${createChallengeDto.requester} is'nt in a category.`,
      );
    }

    // create the challenge
    const challenge = await this.challengeModel.create(createChallengeDto);
    challenge.category = requesterCategory.name;
    challenge.challengeRequestDate = new Date();
    challenge.status = ChallengeStatus.PENDING;
    return challenge.save();
  }

  findAll() {
    return this.challengeModel
      .find()
      .populate('players')
      .populate('requester')
      .exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} challenge`;
  }

  update(id: number, updateChallengeDto: UpdateChallengeDto) {
    return `This action updates a #${id} challenge`;
  }

  remove(id: number) {
    return `This action removes a #${id} challenge`;
  }
}
