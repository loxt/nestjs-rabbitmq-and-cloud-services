import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:123@cluster0.rvrs2ta.mongodb.net/?retryWrites=true&w=majority',
    ),
    PlayersModule,
    CategoriesModule,
  ],
})
export class AppModule {}
