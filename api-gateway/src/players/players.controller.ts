import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { ValidateParamsPipe } from '../common/pipes/validate-params.pipe';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';
import { Observable } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/v1/players')
@UsePipes(ValidationPipe)
export class PlayersController {
  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  async create(@Body() createPlayerDto: CreatePlayerDto) {
    this.clientAdminBackend.emit('create-player', createPlayerDto);
  }

  @Get('players')
  findCategories(@Query('id') id = ''): Observable<any> {
    return this.clientAdminBackend.send('find-players', id);
  }

  @Put('/:id')
  async update(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('id', ValidateParamsPipe) id: string,
  ) {
    this.clientAdminBackend.emit('update-player', {
      id,
      player: updatePlayerDto,
    });
  }

  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Param('id') id: string) {
    console.log(file);
  }
}
