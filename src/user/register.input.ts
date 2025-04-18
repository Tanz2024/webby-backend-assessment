import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, Length, Matches } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @Length(3, 20)
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character',
  })
  password: string;
}
