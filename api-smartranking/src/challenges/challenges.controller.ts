import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';

@Controller('api/v1/challenges')
@UsePipes(ValidationPipe)
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  create(@Body() createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    return this.challengesService.create(createChallengeDto);
  }

  @Get()
  findAll(@Query('playerId') playerId: string): Promise<Challenge[]> {
    if (playerId) {
      return this.challengesService.findPlayerChallenges(playerId);
    }
    return this.challengesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Challenge> {
    return this.challengesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    return this.challengesService.update(+id, updateChallengeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.challengesService.remove(id);
  }
}
