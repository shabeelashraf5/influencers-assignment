/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Query } from '@nestjs/common';
import { TwitterService } from './providers/twitter/twitter.service';

@Controller('podcasts')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Get('search')
  async search(@Query('q') query: string) {
    if (!query) {
      throw new Error('Query parameter "q" is required');
    }
    return this.twitterService.searchPodcasts(query);
  }
}
