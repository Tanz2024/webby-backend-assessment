import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateTagInput {
  @Field()
  @IsNotEmpty()
  name: string;
}
