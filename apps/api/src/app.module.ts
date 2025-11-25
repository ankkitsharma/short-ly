import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UrlsController } from './urls.controller.js';
import { UrlsService } from './urls.service.js';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@repo/auth';

@Module({
  imports: [AuthModule.forRoot({ auth })],
  controllers: [AppController, UrlsController],
  providers: [AppService, UrlsService],
})
export class AppModule {}
