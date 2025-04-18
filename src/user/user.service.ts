import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterInput } from './register.input';
import * as bcrypt from 'bcrypt';
import { User, UserProfile } from '@prisma/client';
import { ChangePasswordResponse } from './change-password-response.model';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Register a new user
   */
  async createUser(data: RegisterInput): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      return await this.prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: hashedPassword,
          profile: {
            create: {
              bio: '',
              avatarUrl: '',
            },
          },
        },
        include: {
          profile: true,
        },
      });
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const targetField = error.meta?.target?.[0];
        if (targetField === 'username') {
          throw new ConflictException('Username already taken');
        } else if (targetField === 'email') {
          throw new ConflictException('Email already registered');
        }
        throw new ConflictException('Username or email already exists');
      }

      throw new InternalServerErrorException('User registration failed');
    }
  }

  /**
   * Get user by ID, including profile
   */
  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Update user profile (bio and avatar)
   */
  async updateProfile(
    userId: string,
    bio: string,
    avatarUrl: string,
  ): Promise<UserProfile> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    return this.prisma.userProfile.update({
      where: { userId },
      data: { bio, avatarUrl },
    });
  }

  /**
   * Delete a user and associated profile
   */
  async deleteUser(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete profile first due to foreign key constraints
    await this.prisma.userProfile.deleteMany({
      where: { userId },
    });

    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  /**
   * Change password after validating old one
   */
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<ChangePasswordResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return {
      success: true,
      message: 'Password changed successfully',
    };
  }
}
