import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  Req,
  UnauthorizedException,
  Headers,
  Logger,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { UrlsService } from './urls.service.js';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('urls')
export class UrlsController {
  private readonly logger = new Logger('UrlsController');
  constructor(private readonly urlsService: UrlsService) {}

  private getUserId(headers: Record<string, string | string[] | undefined>): string | null {
    // Get user ID from header (for proxied requests from Next.js)
    const userId = headers['x-user-id'];

    if (typeof userId === 'string') {
      return userId;
    }
    // Handle array case (shouldn't happen, but just in case)
    if (Array.isArray(userId) && userId.length > 0) {
      return userId[0];
    }
    return null;
  }

  @Post()
  @AllowAnonymous()
  async createUrl(
    @Body() body: { originalUrl: string; shortCode?: string },
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    this.logger.log('POST /urls - Headers:', JSON.stringify(headers));
    const userId = this.getUserId(headers);
    this.logger.log('POST /urls - UserId:', userId);

    if (!userId) {
      this.logger.warn('POST /urls - Unauthorized: No user ID found');
      throw new UnauthorizedException('Unauthorized');
    }
    return await this.urlsService.createUrl(body.originalUrl, userId, body.shortCode);
  }

  @Get()
  @AllowAnonymous()
  async getUserUrls(@Headers() headers: Record<string, string | string[] | undefined>) {
    this.logger.log('GET /urls - Headers:', JSON.stringify(headers));
    const userId = this.getUserId(headers);
    this.logger.log('GET /urls - UserId:', userId);

    if (!userId) {
      this.logger.warn('GET /urls - Unauthorized: No user ID found');
      throw new UnauthorizedException('Unauthorized');
    }
    return await this.urlsService.getUserUrls(userId);
  }

  @Get(':shortCode')
  @AllowAnonymous()
  async redirect(@Param('shortCode') shortCode: string, @Req() req: Request, @Res() res: Response) {
    const url = await this.urlsService.getUrlByShortCode(shortCode);
    this.logger.log('url: ' + JSON.stringify(url));
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Track click
    await this.urlsService.trackClick(url.id, {
      ipAddress: req.ip || (req.headers['x-forwarded-for'] as string) || undefined,
      userAgent: req.headers['user-agent'],
      referer: req.headers.referer,
    });

    // Check if request wants JSON (for Next.js server-side)
    if (req.headers.accept?.includes('application/json')) {
      return res.json({ originalUrl: url.originalUrl });
    }

    return res.redirect(url.originalUrl);
  }
}
