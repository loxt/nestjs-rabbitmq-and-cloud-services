import {
  BadRequestException,
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
import { AwsService } from '../aws/aws.service';

@Controller('api/v1/players')
@UsePipes(ValidationPipe)
export class PlayersController {
  constructor(
    private readonly awsService: AwsService,
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
    const player = await this.clientAdminBackend
      .send('find-players', id)
      .toPromise();

    if (!player) {
      throw new BadRequestException('Player not found');
    }

    const uploadedPlayerPhotoUrl = await this.awsService.uploadFile(file, id);

    const updatePlayerDto: UpdatePlayerDto = {
      photoUrl: uploadedPlayerPhotoUrl.url,
    };

    await this.clientAdminBackend.emit('update-player', {
      id,
      player: updatePlayerDto,
    });
    return this.clientAdminBackend.send('find-players', id);
  }
}
