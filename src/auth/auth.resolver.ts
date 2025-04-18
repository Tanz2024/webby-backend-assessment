import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './login.input';
import { AuthResponse } from './auth.response';
import { User } from '@prisma/client';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(@Args('data') data: LoginInput): Promise<AuthResponse> {
    const user: User = await this.authService.validateUser(data.username, data.password);
    return this.authService.login(user);
  }
}

