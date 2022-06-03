import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModel } from './interfaces/categories/category.model';
import { PlayerModel } from './interfaces/players/player.model';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:123@cluster0.rvrs2ta.mongodb.net/?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      {
        name: 'Category',
        schema: CategoryModel,
      },
      {
        name: 'Player',
        schema: PlayerModel,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
