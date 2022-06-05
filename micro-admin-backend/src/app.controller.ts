import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Category } from './interfaces/categories/category.interface';

@Controller()
export class AppController {
  private readonly logger: Logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @EventPattern('create-category')
  async createCategory(@Payload() category: Category) {
    this.logger.log(`category: ${JSON.stringify(category)}`);
    return this.appService.createCategory(category);
  }

  @MessagePattern('find-categories')
  async findCategories(@Payload() id: string) {
    if (id) {
      return this.appService.findById(id);
    }
    return this.appService.findCategories();
  }
}
