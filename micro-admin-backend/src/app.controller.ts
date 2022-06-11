import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Category } from './interfaces/categories/category.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class AppController {
  private readonly logger: Logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @EventPattern('create-category')
  async createCategory(@Payload() category: Category, @Ctx() ctx: RmqContext) {
    this.logger.log(`category: ${JSON.stringify(category)}`);

    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();

    try {
      await this.appService.createCategory(category);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`category error: ${JSON.stringify(error.message)}`);
      if (ackErrors.some((ackError) => error.message.includes(ackError))) {
        await channel.ack(originalMessage);
      } else {
        throw error;
      }
    }
  }

  @MessagePattern('find-categories')
  async findCategories(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = await context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      if (id) {
        return this.appService.findById(id);
      } else {
        return this.appService.findCategories();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @MessagePattern('update-category')
  async updateCategory(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = await context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const id: string = data.id;
      const category: Category = data.category;
      await this.appService.updateCategory(id, category);
      await channel.ack(originalMsg);
    } catch (error) {
      if (ackErrors.some((ackError) => error.message.includes(ackError))) {
        await channel.ack(originalMsg);
      } else {
        throw error;
      }
    }
  }
}
