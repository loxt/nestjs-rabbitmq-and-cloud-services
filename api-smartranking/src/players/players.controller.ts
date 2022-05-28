import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.create(createPlayerDto);
  }

  @Get()
  async findAll() {
    return this.playersService.findAll();
  }

  @Get()
  async findOne(@Query('email') email: string) {
    return this.playersService.findOne(email);
  }

  @Patch()
  async update(@Body() updatePlayerDto: CreatePlayerDto) {
    return this.playersService.update(updatePlayerDto);
  }
}
