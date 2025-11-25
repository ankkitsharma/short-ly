import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/db';
import { randomBytes } from 'crypto';

@Injectable()
export class UrlsService {
  private generateShortCode(): string {
    return randomBytes(4).toString('base64url').substring(0, 6);
  }

  async createUrl(
    originalUrl: string,
    userId: string,
    customShortCode?: string,
  ) {
    // Validate URL
    try {
      new URL(originalUrl);
    } catch {
      throw new Error('Invalid URL');
    }

    let shortCode = customShortCode || this.generateShortCode();

    // Ensure shortCode is unique
    let attempts = 0;
    while (await prisma.url.findUnique({ where: { shortCode } })) {
      if (customShortCode) {
        throw new Error('Short code already exists');
      }
      shortCode = this.generateShortCode();
      attempts++;
      if (attempts > 10) {
        throw new Error('Failed to generate unique short code');
      }
    }

    const url = await prisma.url.create({
      data: {
        shortCode,
        originalUrl,
        userId,
      },
    });

    return url;
  }

  async getUserUrls(userId: string) {
    const urls = await prisma.url.findMany({
      where: { userId },
      include: {
        clicks: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { clicks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return urls.map((url) => ({
      id: url.id,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      clickCount: url._count.clicks,
      clicks: url.clicks.map((click) => ({
        id: click.id,
        ipAddress: click.ipAddress,
        userAgent: click.userAgent,
        referer: click.referer,
        createdAt: click.createdAt,
      })),
    }));
  }

  async getUrlByShortCode(shortCode: string) {
    return await prisma.url.findUnique({
      where: { shortCode },
    });
  }

  async trackClick(
    urlId: string,
    data: { ipAddress?: string; userAgent?: string; referer?: string },
  ) {
    return await prisma.click.create({
      data: {
        urlId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        referer: data.referer,
      },
    });
  }
}
