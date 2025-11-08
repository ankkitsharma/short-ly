import {Controller, Get} from '@nestjs/common';
import {AppService} from './app.service';
import {User} from "@repo/db";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
   async getHello(): Promise<User | null> {

    return await this.appService.getHello();
  }
}
