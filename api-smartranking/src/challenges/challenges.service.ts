import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Challenge,
  ChallengeStatus,
  Match,
} from './interfaces/challenge.interface';
import { CategoriesService } from '../categories/categories.service';
import { AssignMatchToChallengeDto } from './dto/assign-match-to-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
  ) {}

  async create(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
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

  findPlayerChallenges(playerId: string): Promise<Challenge[]> {
    return this.challengeModel
      .find({ requester: playerId })
      .populate('players')
      .populate('requester')
      .populate('match')
      .exec();
  }

  findAll(): Promise<Challenge[]> {
    return this.challengeModel
      .find()
      .populate('players')
      .populate('requester')
      .populate('match')
      .exec();
  }

  async update(
    id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    const foundedChallenge = await this.challengeModel.findById(id).exec();

    if (!foundedChallenge) {
      throw new NotFoundException(`Challenge with id ${id} not found`);
    }

    if (updateChallengeDto.status) {
      foundedChallenge.challengeResponseDate = new Date();
    }
    foundedChallenge.status = updateChallengeDto.status;
    foundedChallenge.challengeDate = updateChallengeDto.challengeDate;

    return this.challengeModel
      .findOneAndUpdate(
        { _id: id },
        { $set: foundedChallenge },
        {
          new: true,
        },
      )
      .exec();
  }

  async assignMatchToChallenge(
    id: string,
    assignMatchToChallengeDto: AssignMatchToChallengeDto,
  ): Promise<Challenge> {
    const foundedChallenge = await this.challengeModel.findById(id).exec();

    if (!foundedChallenge) {
      throw new NotFoundException(`Challenge with id ${id} not found`);
    }

    const winnerFound = foundedChallenge.players.filter(
      (player) => player._id === assignMatchToChallengeDto.winner,
    );

    if (!winnerFound) {
      throw new BadRequestException(
        `Winner with id ${assignMatchToChallengeDto.winner} is'nt in the challenge.`,
      );
    }

    const match = await this.matchModel.create(assignMatchToChallengeDto);
    match.category = foundedChallenge.category;
    match.players = foundedChallenge.players;

    const matchResult = await match.save();

    foundedChallenge.status = ChallengeStatus.REALIZED;
    foundedChallenge.match = matchResult._id as unknown as Match;

    try {
      return this.challengeModel
        .findOneAndUpdate(
          { _id: id },
          { $set: foundedChallenge },
          {
            new: true,
          },
        )
        .populate('match')
        .exec();
    } catch (error) {
      await this.challengeModel.deleteOne({ _id: matchResult._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string): Promise<void> {
    const foundedChallenge = await this.challengeModel.findById(id).exec();

    if (!foundedChallenge) {
      throw new NotFoundException(`Challenge with id ${id} not found`);
    }

    foundedChallenge.status = ChallengeStatus.CANCELED;
    await this.challengeModel
      .findOneAndUpdate({ _id: id }, { $set: foundedChallenge })
      .exec();
  }
}
