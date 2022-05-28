import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
@UsePipes(ValidationPipe)
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.create(createPlayerDto);
  }

  @Get()
  async findAll(@Query('email') email: string) {
    if (email) {
      return this.playersService.findOne(email);
    }
    return this.playersService.findAll();
  }

  @Patch()
  async update(@Body() updatePlayerDto: CreatePlayerDto) {
    return this.playersService.update(updatePlayerDto);
  }

  @Delete()
  async delete(@Query('email') email: string) {
    return this.playersService.delete(email);
  }
}
