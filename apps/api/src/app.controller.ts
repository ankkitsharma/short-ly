import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {prisma} from "@repo/db";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
      const users = prisma.user.findFirst();
      if (users) {
          console.log("Users found: ", users);
      } else {
          console.log("Users not found");
      }
    return this.appService.getHello();
  }
}
