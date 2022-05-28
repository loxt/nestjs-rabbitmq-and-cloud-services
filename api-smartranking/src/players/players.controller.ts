import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { ValidatePlayerParamsPipe } from './pipes/validate-player-params.pipe';
import { Player } from './interfaces/player.interface';

@Controller('api/v1/players')
@UsePipes(ValidationPipe)
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async create(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.playersService.create(createPlayerDto);
  }

  @Get()
  async findAll(): Promise<Player[]> {
    return this.playersService.findAll();
  }

  @Get('/:id')
  async findOne(
    @Param('id', ValidatePlayerParamsPipe) id: string,
  ): Promise<Player> {
    return this.playersService.findOne(id);
  }

  @Put('/:id')
  async update(
    @Body() updatePlayerDto: CreatePlayerDto,
    @Param('id', ValidatePlayerParamsPipe) id: string,
  ): Promise<Player> {
    return this.playersService.update(id, updatePlayerDto);
  }

  @Delete('/:id')
  async delete(
    @Param('id', ValidatePlayerParamsPipe) id: string,
  ): Promise<any> {
    return this.playersService.delete(id);
  }
}
