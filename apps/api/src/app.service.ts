import {Injectable} from '@nestjs/common';
import {prisma, User} from "@repo/db";

@Injectable()
export class AppService {
  getHello(): Promise<User | null> {

    return prisma.user.findFirst();
  }
}
