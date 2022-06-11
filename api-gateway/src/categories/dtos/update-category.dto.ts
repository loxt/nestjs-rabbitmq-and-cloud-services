import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  readonly description: string;

  @IsArray()
  @ArrayMinSize(1)
  readonly events: Event[];
}

interface Event {
  name: string;
  operation: string;
  value: number;
}
