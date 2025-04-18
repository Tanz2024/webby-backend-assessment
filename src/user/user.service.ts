import {Injectable, ConflictException, NotFoundException,BadRequestException,InternalServerErrorException,} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterInput } from './register.input';
import * as bcrypt from 'bcrypt';
import { User, UserProfile } from '@prisma/client';
import { ChangePasswordResponse } from './change-password-response.model';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Register a new user with hashed password 
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
        const field = error.meta?.target?.[0];
        if (field === 'username') {
          throw new ConflictException('Username already taken');
        } else if (field === 'email') {
          throw new ConflictException('Email already registered');
        }
        throw new ConflictException('Username or email already exists');
      }

      throw new InternalServerErrorException('User registration failed');
    }
  }

  // FIND BY ID
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
// Update user's profile fields
async updateProfile(
  userId: string,
  bio?: string,
  avatarUrl?: string,
): Promise<UserProfile> {
  const profile = await this.prisma.userProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new NotFoundException('User profile not found');
  }

  const updateData: Partial<UserProfile> = {};
  
  if (bio !== undefined) {
    updateData.bio = bio;
  }

  if (avatarUrl !== undefined) {
    updateData.avatarUrl = avatarUrl;
  }

  return this.prisma.userProfile.update({
    where: { userId },
    data: updateData,
  });
}


  // Delete user and ITS ALL associated data
  async deleteUser(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Delete associated postTags and posts
    const posts = await this.prisma.post.findMany({ where: { authorId: userId } });
    const postIds = posts.map(post => post.id);

    await this.prisma.postTag.deleteMany({
      where: { postId: { in: postIds } },
    });

    await this.prisma.post.deleteMany({
      where: { authorId: userId },
    });

    await this.prisma.userProfile.deleteMany({
      where: { userId },
    });

    return this.prisma.user.delete({ where: { id: userId } });
  }

  // Change password after verifying current password
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<ChangePasswordResponse> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return {
      success: true,
      message: 'Password changed successfully',
    };
  }
}
