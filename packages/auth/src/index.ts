import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@repo/db';
import { config } from 'dotenv';

config();

export const auth = betterAuth<BetterAuthOptions>({
  // baseURL: process.env.AUTH_BASE_URL || 'http://localhost:3000',
  // basePath: '/api/auth',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  trustedOrigins: [process.env.CORS_ORIGIN || ''],
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
      // Send an email to the user with a link to reset their password
    },
  },
  socialProviders: {
    google: {
      clientId: '70054790053-te2fh84f63g4pgui5g2manqd60aa0q3l.apps.googleusercontent.com',
      clientSecret: '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',
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    },
  },
});
