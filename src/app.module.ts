import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { TagModule } from './tag/tag.module';
import { CommandBusModule } from './cqrs/command-bus.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ req }),

      formatError: (error: any) => {
        const originalMessage =
          error?.extensions?.originalError?.message || error.message;

        // ✅ Custom error mapping for known errors
        const errorMap: Record<string, { message: string; code: string }> = {
          'Tag name must be unique': { message: 'Tag already exists', code: 'CONFLICT' },
          'Tag already exists': { message: 'Tag already exists', code: 'CONFLICT' },
          'Username or email already exists': { message: 'Username or email already exists', code: 'CONFLICT' },
          'User already registered': { message: 'Username or email already exists', code: 'CONFLICT' },
          'Unauthorized': { message: 'Unauthorized', code: 'UNAUTHENTICATED' },
          'Old password is incorrect': { message: 'Old password is incorrect', code: 'FORBIDDEN' },
          'Post not found': { message: 'Post not found', code: 'NOT_FOUND' },
          'User not found': { message: 'User not found', code: 'NOT_FOUND' },
          'Profile not found': { message: 'Profile not found', code: 'NOT_FOUND' },
          'No post found to delete': { message: 'Post not found', code: 'NOT_FOUND' },
          'You cannot edit this post': { message: 'You cannot edit this post', code: 'FORBIDDEN' },
          'You are not allowed to delete this post': { message: 'You are not allowed to delete this post', code: 'FORBIDDEN' },
        };

        if (errorMap[originalMessage]) {
          return {
            message: errorMap[originalMessage].message,
            extensions: { code: errorMap[originalMessage].code },
          };
        }

        // ✅ Handle class-validator / input validation errors
        if (error.extensions?.code === 'BAD_USER_INPUT') {
          return {
            message: 'Invalid input',
            extensions: { code: 'BAD_REQUEST' },
          };
        }

        // ❌ Fallback for unhandled or internal errors
        return {
          message: error.message,
          path: error.path,
          locations: error.locations,
          extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          },
        };
      },
    }),

    PrismaModule,
    AuthModule,
    UserModule,
    PostModule,
    TagModule,
    CommandBusModule,
  ],
})
export class AppModule {}
