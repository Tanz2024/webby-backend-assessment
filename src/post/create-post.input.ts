import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  Length,
  IsUUID,
  ArrayNotEmpty,
  IsArray,
} from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field()
  @IsNotEmpty()
  @Length(5, 100)
  title: string;

  @Field()
  @IsNotEmpty()
  content: string;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  tagIds: string[];
}
