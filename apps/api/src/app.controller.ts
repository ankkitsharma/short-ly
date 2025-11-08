import {Controller, Get} from '@nestjs/common';
import {AppService} from './app.service.js';
import {User} from "@repo/db";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
   async greetUser(): Promise<string> {

    return await this.appService.greetUser();
  }
}
