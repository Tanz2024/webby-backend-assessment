import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UpdateProfileInput } from './update-profile.input';
import { UserService } from './user.service';
import { RegisterInput } from './register.input';
import { UserModel } from './user.model';
import { UserProfileModel } from './user-profile.model';
import { ChangePasswordResponse } from './change-password-response.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}


  @Mutation(() => UserModel)
  async register(
    @Args('data') data: RegisterInput,
  ): Promise<UserModel> {
    return this.userService.createUser(data);
  }

  @Query(() => UserModel)
  @UseGuards(JwtAuthGuard)
  async getMyProfile(
    @CurrentUser() user: { id: string },
  ): Promise<UserModel> {
    return this.userService.findById(user.id);
  }

  @Mutation(() => UserProfileModel)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: { id: string },
    @Args('data') data: UpdateProfileInput,
  ): Promise<UserProfileModel> {
    const { bio, avatarUrl } = data;
    return this.userService.updateProfile(user.id, bio, avatarUrl);
  }
  

  @Mutation(() => UserModel)
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @CurrentUser() user: { id: string },
  ): Promise<UserModel> {
    return this.userService.deleteUser(user.id);
  }

 
  @Mutation(() => ChangePasswordResponse)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() user: { id: string },
    @Args('oldPassword') oldPassword: string,
    @Args('newPassword') newPassword: string,
  ): Promise<ChangePasswordResponse> {
    await this.userService.changePassword(user.id, oldPassword, newPassword);

    return {
      success: true,
      message: 'Password changed successfully',
    };
  }
}
