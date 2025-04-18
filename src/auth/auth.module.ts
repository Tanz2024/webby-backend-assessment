import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, //  .env (JWT_SECRET=webbyassessmentsecret)
      signOptions: { expiresIn: '7d' },
    })
  ],
  providers: [AuthService,//Authentication logic 
     AuthResolver,// Mutations for auth (e.g., register, login)
      JwtStrategy],//Protect the routes with JWT
})
export class AuthModule {}
