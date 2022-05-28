import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ValidatePlayerParamsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (!value) {
      throw new BadRequestException(
        `Missing required query parameter: ${metadata.data}`,
      );
    }
    return value;
  }
}
