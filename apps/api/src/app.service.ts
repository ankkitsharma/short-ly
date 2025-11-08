import {Injectable} from '@nestjs/common';
import {prisma, User} from "@repo/db";

@Injectable()
export class AppService {
    async greetUser(): Promise<string> {
        const user = await prisma.user.findFirst()
        let greeting = "No user found";

        if (user) {
            greeting = `Hello ${user.name}`;
        }

    return greeting;
  }
}
