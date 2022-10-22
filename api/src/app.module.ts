/* eslint-disable prefer-const */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedModule } from './feed/feed.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './core/all-exceptions.filter';
import { ChatModule } from './chat/chat.module';
import { configuration } from 'config';
let envFilePath = `${process.cwd()}/config/env/.env.development`;
import { join } from 'path';
console.log(`Running in ${process.env.NODE_ENV}`);
if (process.env.NODE_ENV === 'PRODUCTION') {
  envFilePath = '.env';
}

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   envFilePath,
    //   load: [configuration],
    //   isGlobal: true,
    // }),
    TypeOrmModule.forRootAsync({
      // imports: [ConfigModule],
      // inject: [ConfigService],
      // useFactory: (configService: ConfigService) => {
      //   return {
      //     type: 'postgres',
      //     host: configService.get('database.host'),
      //     port: +configService.get('database.port'),
      //     usernasme: configService.get('database.user'),
      //     passxword: configService.get('database.password'),
      //     entities: ['dist/**/*.entity{.ts,.js}'],
      //     synchronize: true,
      //     ssl: {
      //       rejectUnauthorized: false,
      //     },
      //   };
      // },
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
          synchronize: true,
          ssl:
            (configService.get('NODE_ENV') ?? 'development') === 'production'
              ? {
                  rejectUnauthorized: false,
                }
              : undefined,
          url: configService.get('DATABASE_URL'),
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.POSTGRES_HOST,
    //   port: parseInt(<string>process.env.POSTGRES_PORT),
    //   username: process.env.POSTGRES_USER,
    //   password: process.env.POSTGRES_PASSWORD,
    //   database: 'sammy',
    //   autoLoadEntities: true,
    //   synchronize: true, // shouldn't be used in production - may lose data
    // }),
    FeedModule,
    AuthModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
